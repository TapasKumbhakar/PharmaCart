# Search Functionality Test Guide

## Test Cases for Medicine Search

### 1. **Exact Match Tests**
- Search: "Paracetamol" → Should find exact match
- Search: "Ibuprofen" → Should find exact match  
- Search: "Dolo 650" → Should find exact match

### 2. **Partial Match Tests**
- Search: "para" → Should suggest Paracetamol
- Search: "pain" → Should find pain relievers
- Search: "fever" → Should find fever reducers

### 3. **Case Insensitive Tests**
- Search: "PARACETAMOL" → Should work
- Search: "ibuprofen" → Should work
- Search: "Dolo" → Should work

### 4. **Not Found Tests**
- Search: "Aspirin" → Should show "not available" 
- Search: "Vitamin C" → Should show alternatives
- Search: "xyz123" → Should show no results

### 5. **Similar Medicine Suggestions**
- When searching for unavailable medicines, should show:
  - Similar medicines from same category
  - Alternative pain relievers
  - Related medications

## Expected Behavior

### Search Bar Features:
✅ Real-time suggestions dropdown
✅ Medicine images in suggestions
✅ Price display in suggestions
✅ Click to select suggestion
✅ Press Enter to search

### Search Results Page:
✅ Found medicine with Add to Cart & Buy Now
✅ Similar medicines section
✅ "Not Available" message for missing medicines
✅ Alternative suggestions
✅ Back to home button

### Authentication Integration:
✅ Login required for Add to Cart
✅ Login required for Buy Now
✅ Redirect to login if not authenticated
✅ Success messages after adding to cart

## Available Medicines to Test:
1. Paracetamol
2. Dolo 650
3. Ibuprofen
4. Amoxicillin
5. Cetirizine
6. Metformin
7. Azithromycin
8. Pantoprazole
9. Ciprofloxacin
10. Montelukast
11. Loratadine

## Test the Search Now:
1. Go to http://localhost:3000
2. Use the search bar in the navbar
3. Try different search terms
4. Test both found and not found scenarios
5. Verify Add to Cart and Buy Now functionality
