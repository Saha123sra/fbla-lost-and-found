/**
 * AI Matching Service - Free Text-Based Matching
 * Matches found items against lost item requests using keyword extraction,
 * color matching, and text similarity algorithms.
 */

const { query } = require('../config/database');

// Match threshold (0-100) - configurable via environment variable
const MATCH_THRESHOLD = parseInt(process.env.MATCH_THRESHOLD) || 60;

// Common colors to extract from descriptions
const COLORS = [
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white',
  'gray', 'grey', 'brown', 'navy', 'teal', 'maroon', 'beige', 'gold', 'silver',
  'cyan', 'magenta', 'lime', 'olive', 'coral', 'salmon', 'turquoise', 'violet',
  'indigo', 'khaki', 'tan', 'cream', 'burgundy', 'charcoal', 'slate', 'ivory'
];

// Common brands (expandable)
const BRANDS = [
  'nike', 'adidas', 'apple', 'samsung', 'north face', 'northface', 'jansport',
  'under armour', 'underarmour', 'puma', 'vans', 'converse', 'new balance',
  'reebok', 'columbia', 'patagonia', 'herschel', 'fjallraven', 'kanken',
  'airpods', 'beats', 'bose', 'sony', 'jbl', 'hydro flask', 'hydroflask',
  'yeti', 'stanley', 'ti-84', 'ti84', 'casio', 'texas instruments', 'hp',
  'dell', 'lenovo', 'macbook', 'iphone', 'ipad', 'kindle', 'fitbit', 'garmin'
];

// Item type keywords
const ITEM_TYPES = {
  electronics: ['phone', 'laptop', 'tablet', 'airpods', 'earbuds', 'headphones', 'charger', 'cable', 'calculator', 'watch', 'smartwatch'],
  clothing: ['jacket', 'hoodie', 'sweater', 'shirt', 'pants', 'jeans', 'shorts', 'coat', 'vest', 'sweatshirt', 'cardigan'],
  shoes: ['shoes', 'sneakers', 'boots', 'sandals', 'cleats', 'slides', 'crocs', 'flip flops'],
  accessories: ['bag', 'backpack', 'purse', 'wallet', 'watch', 'glasses', 'sunglasses', 'hat', 'cap', 'beanie', 'scarf', 'gloves', 'belt', 'jewelry', 'necklace', 'bracelet', 'ring', 'earrings'],
  books: ['book', 'textbook', 'notebook', 'binder', 'folder', 'planner', 'journal'],
  keys: ['key', 'keys', 'keychain', 'lanyard', 'car key', 'house key'],
  ids: ['id', 'card', 'license', 'student id', 'credit card', 'debit card', 'gift card'],
  sports: ['ball', 'basketball', 'football', 'soccer', 'baseball', 'bat', 'glove', 'helmet', 'pads', 'racket', 'uniform', 'jersey'],
  supplies: ['pencil', 'pen', 'marker', 'highlighter', 'eraser', 'ruler', 'scissors', 'stapler', 'tape']
};

/**
 * Extract keywords, colors, and brands from text
 */
const extractFeatures = (text) => {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);

  // Extract colors
  const colors = COLORS.filter(color => lowerText.includes(color));

  // Extract brands
  const brands = BRANDS.filter(brand => lowerText.includes(brand));

  // Extract item types
  const itemTypes = [];
  for (const [category, keywords] of Object.entries(ITEM_TYPES)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        itemTypes.push({ category, keyword });
      }
    }
  }

  // Extract significant words (nouns, adjectives - basic approach)
  const stopWords = new Set(['a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'shall', 'can', 'need', 'dare', 'ought', 'used', 'to', 'of', 'in', 'for', 'on', 'with',
    'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'between', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why',
    'how', 'all', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until',
    'while', 'although', 'though', 'after', 'before', 'when', 'my', 'your', 'his', 'her', 'its', 'our',
    'their', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
    'us', 'them', 'what', 'which', 'who', 'whom', 'found', 'lost', 'left', 'near', 'around', 'inside']);

  const keywords = words
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter(word => /^[a-z]+$/.test(word));

  return {
    colors,
    brands,
    itemTypes,
    keywords: [...new Set(keywords)] // unique keywords
  };
};

/**
 * Calculate Jaccard similarity between two sets
 */
const jaccardSimilarity = (set1, set2) => {
  if (set1.length === 0 && set2.length === 0) return 0;
  const intersection = set1.filter(item => set2.includes(item));
  const union = [...new Set([...set1, ...set2])];
  return union.length > 0 ? intersection.length / union.length : 0;
};

/**
 * Calculate text similarity using word overlap
 */
const textSimilarity = (text1, text2) => {
  const features1 = extractFeatures(text1);
  const features2 = extractFeatures(text2);

  let score = 0;
  let maxScore = 0;

  // Color match (weight: 15)
  maxScore += 15;
  if (features1.colors.length > 0 && features2.colors.length > 0) {
    const colorSim = jaccardSimilarity(features1.colors, features2.colors);
    score += colorSim * 15;
  }

  // Brand match (weight: 20)
  maxScore += 20;
  if (features1.brands.length > 0 && features2.brands.length > 0) {
    const brandSim = jaccardSimilarity(features1.brands, features2.brands);
    score += brandSim * 20;
  }

  // Item type match (weight: 25)
  maxScore += 25;
  if (features1.itemTypes.length > 0 && features2.itemTypes.length > 0) {
    const types1 = features1.itemTypes.map(t => t.keyword);
    const types2 = features2.itemTypes.map(t => t.keyword);
    const typeSim = jaccardSimilarity(types1, types2);
    score += typeSim * 25;
  }

  // Keyword overlap (weight: 40)
  maxScore += 40;
  if (features1.keywords.length > 0 && features2.keywords.length > 0) {
    const keywordSim = jaccardSimilarity(features1.keywords, features2.keywords);
    score += keywordSim * 40;
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0;
};

/**
 * Analyze text description and extract structured tags
 * This replaces the OpenAI image analysis with text-based extraction
 */
const analyzeDescription = (name, description) => {
  const fullText = `${name} ${description}`;
  const features = extractFeatures(fullText);

  return {
    itemType: features.itemTypes[0]?.keyword || null,
    category: features.itemTypes[0]?.category || 'other',
    colors: features.colors,
    brand: features.brands[0] || null,
    keywords: features.keywords.slice(0, 10),
    description: description.substring(0, 200)
  };
};

/**
 * Analyze an image - for now, just returns null since we're using free text matching
 * Images are still uploaded for visual reference, but matching is text-based
 */
const analyzeImage = async (imageUrl) => {
  // Image analysis requires paid APIs
  // The image is still stored for users to view, but matching uses text descriptions
  console.log('Image stored for reference:', imageUrl);
  return null;
};

/**
 * Calculate match score between a found item and a lost item request
 */
const calculateMatchScore = async (foundItem, request) => {
  let score = 0;
  const reasons = [];

  // 1. Category match (15 points)
  if (foundItem.category_id && request.category_id &&
      foundItem.category_id === request.category_id) {
    score += 15;
    reasons.push('Same category');
  }

  // 2. Location match (10 points)
  if (foundItem.location_id && request.location_id &&
      foundItem.location_id === request.location_id) {
    score += 10;
    reasons.push('Same location');
  }

  // 3. Text similarity between descriptions (75 points max)
  const foundText = `${foundItem.name} ${foundItem.description}`;
  const requestText = `${request.name} ${request.description}`;
  const similarity = textSimilarity(foundText, requestText);
  const textScore = (similarity / 100) * 75;
  score += textScore;

  if (textScore >= 50) {
    reasons.push('Strong description match');
  } else if (textScore >= 30) {
    reasons.push('Moderate description match');
  } else if (textScore >= 15) {
    reasons.push('Some keywords match');
  }

  // Extract what matched for debugging
  const foundFeatures = extractFeatures(foundText);
  const requestFeatures = extractFeatures(requestText);

  if (foundFeatures.colors.some(c => requestFeatures.colors.includes(c))) {
    reasons.push('Color match');
  }
  if (foundFeatures.brands.some(b => requestFeatures.brands.includes(b))) {
    reasons.push('Brand match');
  }

  return {
    score: Math.min(100, Math.round(score)),
    reasons
  };
};

/**
 * Find all active requests that match a newly found item
 */
const findMatchingRequests = async (foundItem) => {
  try {
    // Get all active requests
    const result = await query(
      `SELECT r.*, u.email, u.first_name, u.last_name,
              c.name as category_name, l.name as location_name
       FROM requests r
       JOIN users u ON r.user_id = u.id
       LEFT JOIN categories c ON r.category_id = c.id
       LEFT JOIN locations l ON r.location_id = l.id
       WHERE r.status = 'active'
       ORDER BY r.created_at DESC`
    );

    const matches = [];

    for (const request of result.rows) {
      const matchResult = await calculateMatchScore(foundItem, request);

      if (matchResult.score >= MATCH_THRESHOLD) {
        matches.push({
          request,
          score: matchResult.score,
          reasons: matchResult.reasons
        });
      }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    console.log(`Found ${matches.length} matches above threshold (${MATCH_THRESHOLD}) for item "${foundItem.name}"`);

    return matches;
  } catch (error) {
    console.error('Find matching requests error:', error);
    return [];
  }
};

module.exports = {
  analyzeImage,
  analyzeDescription,
  extractFeatures,
  calculateMatchScore,
  findMatchingRequests,
  MATCH_THRESHOLD
};
