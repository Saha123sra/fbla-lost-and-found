/**
 * AI Matching Service - Enhanced Text-Based Matching
 * Matches found items against lost item requests using:
 * - Synonym expansion
 * - Fuzzy matching for typos
 * - Keyword extraction with better categorization
 * - Flexible scoring algorithm
 */

const { query } = require('../config/database');

// Lower threshold for more matches (was 60, now 35)
const MATCH_THRESHOLD = parseInt(process.env.MATCH_THRESHOLD) || 35;

// Synonyms - items that should match each other
const SYNONYMS = {
  // Bags
  'bag': ['backpack', 'bookbag', 'rucksack', 'satchel', 'tote', 'duffel', 'duffle', 'messenger bag', 'gym bag', 'laptop bag'],
  'backpack': ['bag', 'bookbag', 'rucksack', 'school bag', 'knapsack'],
  'purse': ['handbag', 'clutch', 'wallet', 'bag'],
  'wallet': ['purse', 'billfold', 'card holder'],

  // Clothing
  'hoodie': ['sweatshirt', 'sweater', 'pullover', 'hooded sweatshirt'],
  'sweatshirt': ['hoodie', 'sweater', 'pullover', 'crewneck'],
  'jacket': ['coat', 'windbreaker', 'blazer', 'parka', 'fleece'],
  'coat': ['jacket', 'parka', 'overcoat'],
  'pants': ['jeans', 'trousers', 'slacks', 'khakis', 'joggers', 'sweats', 'sweatpants'],
  'jeans': ['pants', 'denim', 'trousers'],
  'shirt': ['tee', 't-shirt', 'tshirt', 'top', 'blouse', 'polo'],

  // Electronics
  'phone': ['cell phone', 'cellphone', 'mobile', 'smartphone', 'iphone', 'android'],
  'iphone': ['phone', 'apple phone', 'smartphone'],
  'laptop': ['computer', 'notebook', 'macbook', 'chromebook'],
  'earbuds': ['airpods', 'headphones', 'earphones', 'ear buds'],
  'airpods': ['earbuds', 'earphones', 'headphones', 'apple earbuds'],
  'headphones': ['earbuds', 'earphones', 'headset', 'beats'],
  'charger': ['charging cable', 'power cord', 'adapter', 'cable'],
  'calculator': ['ti-84', 'ti84', 'graphing calculator', 'scientific calculator'],

  // Accessories
  'glasses': ['eyeglasses', 'spectacles', 'frames', 'reading glasses'],
  'sunglasses': ['shades', 'sun glasses'],
  'watch': ['smartwatch', 'apple watch', 'fitbit', 'timepiece', 'wristwatch'],
  'hat': ['cap', 'beanie', 'snapback', 'baseball cap', 'visor'],
  'cap': ['hat', 'baseball cap', 'snapback'],
  'beanie': ['hat', 'winter hat', 'knit cap', 'stocking cap'],

  // School supplies
  'notebook': ['journal', 'notepad', 'composition book', 'spiral'],
  'binder': ['folder', 'trapper keeper', '3-ring binder'],
  'folder': ['binder', 'portfolio'],
  'pencil case': ['pencil pouch', 'pencil bag', 'pen case'],

  // Keys
  'keys': ['key', 'keychain', 'car keys', 'house keys', 'key ring'],
  'keychain': ['keys', 'lanyard', 'key ring'],
  'lanyard': ['keychain', 'id holder', 'badge holder'],

  // ID/Cards
  'id': ['student id', 'identification', 'id card', 'badge'],
  'student id': ['id', 'school id', 'id card'],

  // Water bottles
  'water bottle': ['bottle', 'hydro flask', 'hydroflask', 'yeti', 'stanley', 'tumbler', 'thermos'],
  'hydroflask': ['water bottle', 'hydro flask', 'bottle'],
  'yeti': ['water bottle', 'tumbler', 'cup'],
  'stanley': ['water bottle', 'tumbler', 'cup'],

  // Sports
  'ball': ['basketball', 'football', 'soccer ball', 'volleyball', 'baseball'],
  'jersey': ['uniform', 'sports shirt', 'team shirt'],
};

// Common colors to extract
const COLORS = [
  'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'black', 'white',
  'gray', 'grey', 'brown', 'navy', 'teal', 'maroon', 'beige', 'gold', 'silver',
  'cyan', 'magenta', 'lime', 'olive', 'coral', 'turquoise', 'violet', 'indigo',
  'khaki', 'tan', 'cream', 'burgundy', 'charcoal', 'rose', 'mint', 'lavender',
  'peach', 'rust', 'mustard', 'forest', 'baby blue', 'hot pink', 'neon'
];

// Color synonyms
const COLOR_SYNONYMS = {
  'grey': 'gray',
  'baby blue': 'blue',
  'navy': 'blue',
  'forest': 'green',
  'mint': 'green',
  'lime': 'green',
  'olive': 'green',
  'burgundy': 'red',
  'maroon': 'red',
  'coral': 'red',
  'rose': 'pink',
  'hot pink': 'pink',
  'lavender': 'purple',
  'violet': 'purple',
  'magenta': 'purple',
  'cream': 'white',
  'ivory': 'white',
  'beige': 'tan',
  'khaki': 'tan',
  'mustard': 'yellow',
  'gold': 'yellow',
  'rust': 'orange',
  'peach': 'orange',
  'charcoal': 'gray',
  'silver': 'gray',
};

// Common brands
const BRANDS = [
  'nike', 'adidas', 'apple', 'samsung', 'north face', 'northface', 'jansport',
  'under armour', 'underarmour', 'puma', 'vans', 'converse', 'new balance',
  'reebok', 'columbia', 'patagonia', 'herschel', 'fjallraven', 'kanken',
  'airpods', 'beats', 'bose', 'sony', 'jbl', 'hydro flask', 'hydroflask',
  'yeti', 'stanley', 'ti-84', 'ti84', 'casio', 'texas instruments', 'hp',
  'dell', 'lenovo', 'macbook', 'iphone', 'ipad', 'kindle', 'fitbit', 'garmin',
  'ray ban', 'rayban', 'oakley', 'gucci', 'coach', 'michael kors', 'kate spade',
  'lululemon', 'champion', 'ralph lauren', 'polo', 'tommy hilfiger', 'gap',
  'american eagle', 'hollister', 'abercrombie', 'victoria secret', 'pink',
  'louis vuitton', 'chanel', 'supreme', 'jordan', 'air jordan', 'asics',
  'skechers', 'birkenstock', 'crocs', 'ugg', 'timberland', 'sperry'
];

// Item categories with keywords
const ITEM_TYPES = {
  electronics: ['phone', 'laptop', 'tablet', 'airpods', 'earbuds', 'headphones', 'charger', 'cable', 'calculator', 'watch', 'smartwatch', 'iphone', 'ipad', 'macbook', 'computer', 'kindle', 'speaker', 'camera', 'gopro', 'drone', 'controller', 'mouse', 'keyboard'],
  clothing: ['jacket', 'hoodie', 'sweater', 'shirt', 'pants', 'jeans', 'shorts', 'coat', 'vest', 'sweatshirt', 'cardigan', 'dress', 'skirt', 'blouse', 'polo', 'jersey', 'uniform', 'blazer', 'suit', 'tie', 'leggings', 'joggers', 'sweatpants'],
  shoes: ['shoes', 'sneakers', 'boots', 'sandals', 'cleats', 'slides', 'crocs', 'flip flops', 'heels', 'flats', 'loafers', 'slippers', 'running shoes', 'basketball shoes', 'football cleats'],
  bags: ['bag', 'backpack', 'purse', 'wallet', 'glasses', 'sunglasses', 'hat', 'cap', 'beanie', 'scarf', 'gloves', 'belt', 'jewelry', 'necklace', 'bracelet', 'ring', 'earrings', 'watch', 'headband', 'hair tie', 'scrunchie', 'lanyard', 'tote', 'duffel', 'messenger', 'satchel', 'fanny pack', 'lunch bag', 'lunchbox', 'pencil case', 'pencil pouch'],
  books: ['book', 'textbook', 'notebook', 'binder', 'folder', 'planner', 'journal', 'novel', 'workbook', 'manual', 'dictionary', 'agenda'],
  keys: ['key', 'keys', 'keychain', 'lanyard', 'car key', 'house key', 'key ring', 'fob', 'remote'],
  ids: ['id', 'card', 'license', 'student id', 'credit card', 'debit card', 'gift card', 'badge', 'pass', 'permit', 'passport'],
  sports: ['ball', 'basketball', 'football', 'soccer', 'baseball', 'bat', 'glove', 'helmet', 'pads', 'racket', 'uniform', 'jersey', 'cleats', 'shin guards', 'goggles', 'swim', 'tennis', 'volleyball', 'lacrosse', 'hockey', 'golf', 'skateboard', 'rollerblades'],
  supplies: ['pencil', 'pen', 'marker', 'highlighter', 'eraser', 'ruler', 'scissors', 'stapler', 'tape', 'glue', 'crayons', 'colored pencils', 'sharpener', 'calculator', 'compass', 'protractor'],
  bottles: ['water bottle', 'bottle', 'tumbler', 'thermos', 'cup', 'mug', 'hydroflask', 'hydro flask', 'yeti', 'stanley', 'contigo', 'nalgene'],
  food: ['lunchbox', 'lunch box', 'lunch bag', 'container', 'tupperware', 'snack', 'food container'],
  toys: ['toy', 'stuffed animal', 'plush', 'teddy bear', 'action figure', 'doll', 'game', 'puzzle', 'cards', 'pokemon', 'lego', 'fidget'],
  instruments: ['instrument', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'saxophone', 'drum', 'piano', 'keyboard', 'ukulele', 'recorder', 'harmonica']
};

// Stop words to filter out
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'can', 'need', 'to', 'of', 'in', 'for', 'on',
  'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during', 'before', 'after',
  'above', 'below', 'between', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'each', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
  'too', 'very', 'just', 'and', 'but', 'if', 'or', 'because', 'until', 'while',
  'my', 'your', 'his', 'her', 'its', 'our', 'their', 'this', 'that', 'these', 'those',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'us', 'them',
  'what', 'which', 'who', 'whom', 'found', 'lost', 'left', 'near', 'around', 'inside',
  'please', 'help', 'looking', 'think', 'believe', 'maybe', 'probably', 'somewhere',
  'someone', 'something', 'anything', 'everything', 'nothing', 'anywhere', 'everywhere'
]);

/**
 * Calculate Levenshtein distance between two strings (for fuzzy matching)
 */
const levenshteinDistance = (str1, str2) => {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
};

/**
 * Check if two words are similar (fuzzy match)
 */
const isFuzzyMatch = (word1, word2, threshold = 0.8) => {
  if (word1 === word2) return true;
  if (word1.length < 3 || word2.length < 3) return word1 === word2;

  const distance = levenshteinDistance(word1, word2);
  const maxLen = Math.max(word1.length, word2.length);
  const similarity = 1 - (distance / maxLen);

  return similarity >= threshold;
};

/**
 * Expand a word to include its synonyms
 */
const expandWithSynonyms = (word) => {
  const expanded = [word];
  const lowerWord = word.toLowerCase();

  // Check if this word has synonyms
  if (SYNONYMS[lowerWord]) {
    expanded.push(...SYNONYMS[lowerWord]);
  }

  // Check if this word IS a synonym of something else
  for (const [key, synonyms] of Object.entries(SYNONYMS)) {
    if (synonyms.includes(lowerWord) && !expanded.includes(key)) {
      expanded.push(key);
    }
  }

  return [...new Set(expanded)];
};

/**
 * Normalize a color to its base color
 */
const normalizeColor = (color) => {
  return COLOR_SYNONYMS[color] || color;
};

/**
 * Extract features from text
 */
const extractFeatures = (text) => {
  if (!text) return { colors: [], brands: [], itemTypes: [], keywords: [], expandedKeywords: [] };

  const lowerText = text.toLowerCase();
  const words = lowerText.split(/[\s,.\-_!?()]+/).filter(w => w.length > 0);

  // Extract colors (and normalize them)
  const rawColors = COLORS.filter(color => lowerText.includes(color));
  const colors = [...new Set(rawColors.map(normalizeColor))];

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

  // Extract significant keywords
  const keywords = words
    .filter(word => word.length > 2 && !STOP_WORDS.has(word))
    .filter(word => /^[a-z0-9]+$/.test(word));

  // Expand keywords with synonyms
  const expandedKeywords = [];
  for (const keyword of keywords) {
    expandedKeywords.push(...expandWithSynonyms(keyword));
  }

  return {
    colors,
    brands,
    itemTypes,
    keywords: [...new Set(keywords)],
    expandedKeywords: [...new Set(expandedKeywords)]
  };
};

/**
 * Calculate similarity score between two feature sets
 */
const calculateFeatureSimilarity = (features1, features2) => {
  let score = 0;
  const reasons = [];

  // Color match (20 points) - using normalized colors
  if (features1.colors.length > 0 && features2.colors.length > 0) {
    const colorMatch = features1.colors.some(c1 =>
      features2.colors.some(c2 => c1 === c2)
    );
    if (colorMatch) {
      score += 20;
      reasons.push('Color match');
    }
  }

  // Brand match (25 points)
  if (features1.brands.length > 0 && features2.brands.length > 0) {
    const brandMatch = features1.brands.some(b1 =>
      features2.brands.some(b2 => b1 === b2 || isFuzzyMatch(b1, b2))
    );
    if (brandMatch) {
      score += 25;
      reasons.push('Brand match');
    }
  }

  // Item type match (30 points) - check both exact and category match
  if (features1.itemTypes.length > 0 && features2.itemTypes.length > 0) {
    // Exact keyword match
    const exactMatch = features1.itemTypes.some(t1 =>
      features2.itemTypes.some(t2 => t1.keyword === t2.keyword)
    );

    // Same category match
    const categoryMatch = features1.itemTypes.some(t1 =>
      features2.itemTypes.some(t2 => t1.category === t2.category)
    );

    if (exactMatch) {
      score += 30;
      reasons.push('Item type match');
    } else if (categoryMatch) {
      score += 15;
      reasons.push('Same category');
    }
  }

  // Keyword overlap with synonyms (25 points)
  if (features1.expandedKeywords.length > 0 && features2.expandedKeywords.length > 0) {
    let matchCount = 0;

    for (const kw1 of features1.expandedKeywords) {
      for (const kw2 of features2.expandedKeywords) {
        if (kw1 === kw2 || isFuzzyMatch(kw1, kw2, 0.75)) {
          matchCount++;
          break;
        }
      }
    }

    const matchRatio = matchCount / Math.min(features1.expandedKeywords.length, features2.expandedKeywords.length);
    const keywordScore = Math.min(25, matchRatio * 30);
    score += keywordScore;

    if (keywordScore >= 15) {
      reasons.push('Strong keyword match');
    } else if (keywordScore >= 8) {
      reasons.push('Some keywords match');
    }
  }

  return { score, reasons };
};

/**
 * Analyze text description and extract structured tags
 */
const analyzeDescription = (name, description) => {
  const fullText = `${name || ''} ${description || ''}`;
  const features = extractFeatures(fullText);

  return {
    itemType: features.itemTypes[0]?.keyword || null,
    category: features.itemTypes[0]?.category || 'other',
    colors: features.colors,
    brand: features.brands[0] || null,
    keywords: features.keywords.slice(0, 15),
    expandedKeywords: features.expandedKeywords.slice(0, 30),
    description: (description || '').substring(0, 200)
  };
};

/**
 * Analyze an image - mock implementation for demo
 * Returns simulated AI vision analysis based on filename hints and random plausible values
 */
const analyzeImage = async (imageUrl) => {
  console.log('Mock AI analyzing image:', imageUrl);

  // Extract hints from filename if available
  const filename = imageUrl.split('/').pop()?.toLowerCase() || '';

  // Mock detection based on common item types
  const detectedColors = [];
  const detectedItems = [];

  // Check filename for color hints
  for (const color of COLORS.slice(0, 15)) {
    if (filename.includes(color)) detectedColors.push(color);
  }

  // Check filename for item type hints
  for (const [category, keywords] of Object.entries(ITEM_TYPES)) {
    for (const keyword of keywords.slice(0, 5)) {
      if (filename.includes(keyword.replace(' ', ''))) {
        detectedItems.push({ category, keyword });
      }
    }
  }

  // Generate realistic mock response
  const mockColors = detectedColors.length > 0 ? detectedColors :
    [['blue', 'black', 'gray', 'red', 'green'][Math.floor(Math.random() * 5)]];

  const mockItemType = detectedItems.length > 0 ? detectedItems[0] :
    { category: 'other', keyword: 'item' };

  const result = {
    itemType: mockItemType.keyword,
    category: mockItemType.category,
    colors: mockColors,
    brand: null,
    keywords: [mockItemType.keyword, 'found', 'school'],
    expandedKeywords: expandWithSynonyms(mockItemType.keyword),
    confidence: 0.65 + Math.random() * 0.25, // 65-90% confidence
    source: 'mock-ai'
  };

  console.log('Mock AI analysis result:', result);
  return result;
};

/**
 * Calculate match score between a found item and a lost item request
 */
const calculateMatchScore = async (foundItem, request) => {
  let score = 0;
  const reasons = [];

  // 1. Category match from database (15 points)
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

  // 3. Feature-based similarity (75 points max)
  const foundText = `${foundItem.name || ''} ${foundItem.description || ''}`;
  const requestText = `${request.name || ''} ${request.description || ''}`;

  const foundFeatures = extractFeatures(foundText);
  const requestFeatures = extractFeatures(requestText);

  const featureSimilarity = calculateFeatureSimilarity(foundFeatures, requestFeatures);
  score += featureSimilarity.score;
  reasons.push(...featureSimilarity.reasons);

  // Debug logging
  console.log(`Matching "${foundItem.name}" vs "${request.name}": score=${score}, reasons=[${reasons.join(', ')}]`);

  return {
    score: Math.min(100, Math.round(score)),
    reasons: [...new Set(reasons)]
  };
};

/**
 * Find all active requests that match a newly found item
 */
const findMatchingRequests = async (foundItem) => {
  try {
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

    matches.sort((a, b) => b.score - a.score);

    console.log(`Found ${matches.length} matches above threshold (${MATCH_THRESHOLD}) for item "${foundItem.name}"`);
    if (matches.length > 0) {
      console.log('Top matches:', matches.slice(0, 5).map(m =>
        `${m.request.name} (${m.score}%): ${m.reasons.join(', ')}`
      ));
    }

    return matches;
  } catch (error) {
    console.error('Find matching requests error:', error);
    return [];
  }
};

/**
 * Find matching items for a lost item request
 */
const findMatchingItems = async (request) => {
  try {
    const result = await query(
      `SELECT i.*, c.name as category_name, l.name as location_name
       FROM items i
       LEFT JOIN categories c ON i.category_id = c.id
       LEFT JOIN locations l ON i.location_id = l.id
       WHERE i.status = 'available'
       ORDER BY i.created_at DESC`
    );

    const matches = [];

    for (const item of result.rows) {
      const matchResult = await calculateMatchScore(item, request);

      if (matchResult.score >= MATCH_THRESHOLD) {
        matches.push({
          item,
          score: matchResult.score,
          reasons: matchResult.reasons
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    console.log(`Found ${matches.length} matching items above threshold (${MATCH_THRESHOLD}) for request "${request.name}"`);

    return matches;
  } catch (error) {
    console.error('Find matching items error:', error);
    return [];
  }
};

module.exports = {
  analyzeImage,
  analyzeDescription,
  extractFeatures,
  calculateMatchScore,
  findMatchingRequests,
  findMatchingItems,
  MATCH_THRESHOLD
};
