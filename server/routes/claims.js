const express = require('express');
const { query, transaction } = require('../config/database');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { sendEmail } = require('../services/emailService');

const router = express.Router();

// ===================
// GET USER'S CLAIMS
// ===================
router.get('/', authenticate, async (req, res) => {
  try {
    let queryText;
    let params;
    
    if (req.user.role === 'admin') {
      // Admins see all claims
      queryText = `
        SELECT 
          c.*,
          i.name as item_name, i.image_url, i.description as item_description,
          u.first_name || ' ' || u.last_name as user_name,
          u.email as user_email, u.student_id as user_student_id
        FROM claims c
        JOIN items i ON c.item_id = i.id
        JOIN users u ON c.user_id = u.id
        ORDER BY c.created_at DESC
      `;
      params = [];
    } else {
      // Regular users see only their claims
      queryText = `
        SELECT 
          c.*,
          i.name as item_name, i.image_url, i.description as item_description
        FROM claims c
        JOIN items i ON c.item_id = i.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC
      `;
      params = [req.user.id];
    }
    
    const result = await query(queryText, params);
    res.json(result.rows);
    
  } catch (error) {
    console.error('Get claims error:', error);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// ===================
// GET SINGLE CLAIM
// ===================
router.get('/:id', authenticate, async (req, res) => {
  try {
    const result = await query(
      `SELECT 
        c.*,
        i.name as item_name, i.image_url, i.description as item_description,
        i.location_detail, i.found_date,
        cat.name as category_name,
        loc.name as location_name
      FROM claims c
      JOIN items i ON c.item_id = i.id
      LEFT JOIN categories cat ON i.category_id = cat.id
      LEFT JOIN locations loc ON i.location_id = loc.id
      WHERE c.id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    
    const claim = result.rows[0];
    
    // Check authorization
    if (claim.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to view this claim' });
    }
    
    res.json(claim);
    
  } catch (error) {
    console.error('Get claim error:', error);
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

// ===================
// CREATE CLAIM
// ===================
router.post('/', authenticate, async (req, res) => {
  try {
    const { itemId, proofDescription, proofImageUrl, contactEmail, contactPhone } = req.body;
    
    // Validation
    if (!itemId || !proofDescription) {
      return res.status(400).json({ error: 'Item ID and proof description are required' });
    }
    
    // Check if item exists and is available
    const itemResult = await query(
      'SELECT id, name, status FROM items WHERE id = $1',
      [itemId]
    );
    
    if (itemResult.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = itemResult.rows[0];
    
    if (item.status !== 'available') {
      return res.status(400).json({ error: 'This item is not available for claiming' });
    }
    
    // Check for existing pending claim by this user
    const existingClaim = await query(
      "SELECT id FROM claims WHERE item_id = $1 AND user_id = $2 AND status = 'pending'",
      [itemId, req.user.id]
    );
    
    if (existingClaim.rows.length > 0) {
      return res.status(400).json({ error: 'You already have a pending claim for this item' });
    }
    
    // Create claim using transaction
    const claim = await transaction(async (client) => {
      // Create the claim
      const claimResult = await client.query(
        `INSERT INTO claims (item_id, user_id, proof_description, proof_image_url, contact_email, contact_phone)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [itemId, req.user.id, proofDescription, proofImageUrl, contactEmail || req.user.email, contactPhone]
      );
      
      // Update item status to pending
      await client.query(
        "UPDATE items SET status = 'pending' WHERE id = $1",
        [itemId]
      );
      
      return claimResult.rows[0];
    });
    
    // Send confirmation email
    await sendEmail(
      contactEmail || req.user.email,
      'claimSubmitted',
      [req.user.first_name, item.name, claim.id.substring(0, 8).toUpperCase()]
    );
    
    // Notify admins (create notification)
    const admins = await query("SELECT id FROM users WHERE role = 'admin'");
    for (const admin of admins.rows) {
      await query(
        `INSERT INTO notifications (user_id, type, title, message, link)
         VALUES ($1, 'new_claim', 'New Claim Submitted', $2, $3)`,
        [admin.id, `A claim has been submitted for ${item.name}`, `/admin/claims/${claim.id}`]
      );
    }
    
    res.status(201).json({
      message: 'Claim submitted successfully',
      claim,
      referenceId: `CLM-${claim.id.substring(0, 8).toUpperCase()}`
    });
    
  } catch (error) {
    console.error('Create claim error:', error);
    res.status(500).json({ error: 'Failed to submit claim' });
  }
});

// ===================
// UPDATE CLAIM (Admin only - Approve/Deny)
// ===================
router.patch('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status, reviewNotes, denialReason, pickupDate, pickupTime, pickupLocation } = req.body;
    
    // Validate status
    const validStatuses = ['approved', 'denied', 'cancelled', 'picked_up'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    // Get claim details
    const claimResult = await query(
      `SELECT c.*, i.name as item_name, u.email, u.first_name
       FROM claims c
       JOIN items i ON c.item_id = i.id
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1`,
      [req.params.id]
    );
    
    if (claimResult.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    
    const claim = claimResult.rows[0];

    // Convert empty strings to null for database fields
    const pickupDateValue = pickupDate && pickupDate.trim() !== '' ? pickupDate : null;
    const pickupTimeValue = pickupTime && pickupTime.trim() !== '' ? pickupTime : null;
    const pickupLocationValue = pickupLocation && pickupLocation.trim() !== '' ? pickupLocation : null;
    const denialReasonValue = denialReason && denialReason.trim() !== '' ? denialReason : null;
    const reviewNotesValue = reviewNotes && reviewNotes.trim() !== '' ? reviewNotes : null;

    // Update claim using transaction
    const updatedClaim = await transaction(async (client) => {
      // Update the claim
      const result = await client.query(
        `UPDATE claims SET
          status = $1,
          reviewed_by = $2,
          reviewed_at = NOW(),
          review_notes = $3,
          denial_reason = $4,
          pickup_date = $5,
          pickup_time = $6,
          pickup_location = $7,
          updated_at = NOW()
         WHERE id = $8
         RETURNING *`,
        [status, req.user.id, reviewNotesValue, denialReasonValue, pickupDateValue, pickupTimeValue, pickupLocationValue, req.params.id]
      );
      
      // Update item status based on claim status
      if (status === 'approved') {
        await client.query(
          `UPDATE items SET status = 'claimed', claimed_by = $1, claimed_date = NOW() WHERE id = $2`,
          [claim.user_id, claim.item_id]
        );
      } else if (status === 'denied') {
        // Check if there are other pending claims
        const otherClaims = await client.query(
          "SELECT id FROM claims WHERE item_id = $1 AND status = 'pending' AND id != $2",
          [claim.item_id, req.params.id]
        );
        
        if (otherClaims.rows.length === 0) {
          await client.query(
            "UPDATE items SET status = 'available' WHERE id = $1",
            [claim.item_id]
          );
        }
      }
      
      return result.rows[0];
    });
    
    // Send email notification
    if (status === 'approved') {
      await sendEmail(
        claim.email,
        'claimApproved',
        [claim.first_name, claim.item_name, pickupDate, pickupTime, pickupLocation]
      );
    } else if (status === 'denied') {
      await sendEmail(
        claim.email,
        'claimDenied',
        [claim.first_name, claim.item_name, denialReason]
      );
    }
    
    // Create notification for user
    await query(
      `INSERT INTO notifications (user_id, type, title, message, link)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        claim.user_id,
        `claim_${status}`,
        `Claim ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        `Your claim for ${claim.item_name} has been ${status}.`,
        `/my-claims/${req.params.id}`
      ]
    );
    
    res.json({
      message: `Claim ${status} successfully`,
      claim: updatedClaim
    });
    
  } catch (error) {
    console.error('Update claim error:', error);
    res.status(500).json({ error: 'Failed to update claim' });
  }
});

// ===================
// CANCEL CLAIM (User cancels their own claim)
// ===================
router.post('/:id/cancel', authenticate, async (req, res) => {
  try {
    // Get claim
    const claimResult = await query(
      'SELECT * FROM claims WHERE id = $1',
      [req.params.id]
    );
    
    if (claimResult.rows.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }
    
    const claim = claimResult.rows[0];
    
    // Check authorization
    if (claim.user_id !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to cancel this claim' });
    }
    
    // Check if claim can be cancelled
    if (claim.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending claims can be cancelled' });
    }
    
    // Cancel claim using transaction
    await transaction(async (client) => {
      await client.query(
        "UPDATE claims SET status = 'cancelled', updated_at = NOW() WHERE id = $1",
        [req.params.id]
      );
      
      // Check if there are other pending claims
      const otherClaims = await client.query(
        "SELECT id FROM claims WHERE item_id = $1 AND status = 'pending' AND id != $2",
        [claim.item_id, req.params.id]
      );
      
      if (otherClaims.rows.length === 0) {
        await client.query(
          "UPDATE items SET status = 'available' WHERE id = $1",
          [claim.item_id]
        );
      }
    });
    
    res.json({ message: 'Claim cancelled successfully' });
    
  } catch (error) {
    console.error('Cancel claim error:', error);
    res.status(500).json({ error: 'Failed to cancel claim' });
  }
});

module.exports = router;