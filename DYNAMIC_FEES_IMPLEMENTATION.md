# Dynamic Fee Structure Implementation

## Overview

The fee rendering system has been completely refactored to dynamically handle multiple different fee structure patterns across various schools in the database. The system automatically detects the pattern type and renders the appropriate UI components.

## Pattern Detection Results

The system successfully detects and renders **3 distinct fee structure patterns**:

- **Simple Pattern**: 11 occurrences (School 3 style - string-based fees)
- **Nested Pattern**: 7 occurrences (School 4 style - object-based with nested pricing)
- **RTA Pattern**: 7 occurrences (School 5 style - RTA fees array + training rates)
- **Unknown Pattern**: 0 occurrences ✅

## Architecture

### 1. Type System (`lib/types.ts`)

Added comprehensive type definitions for all fee patterns:

```typescript
- RTAFeeItem: Structure for RTA fee items
- SimpleCourseFee: String-based pricing (e.g., "AED 2,000")
- NestedCourseFee: Object-based pricing with hourly/total sub-properties
- RTAStyleCourseFee: RTA fees array + training rates object
- CourseFee: Union type of all patterns
- OtherFee: Dynamic column support with index signature
```

### 2. Pattern Detection (`lib/fee-utils.ts`)

Utility functions for pattern detection and data processing:

- `detectFeePattern()`: Identifies which pattern a fee structure uses
- `isSimpleCourseFee()`: Type guard for simple pattern
- `isNestedCourseFee()`: Type guard for nested pattern
- `isRTAStyleCourseFee()`: Type guard for RTA pattern
- `formatCurrency()`: Handles both string and numeric currency formatting
- `formatFieldLabel()`: Converts field_name to Field Name
- `sortFieldsByPriority()`: Orders fields by importance

### 3. Pattern-Specific Components

#### `SimpleCourseFeeCard` (`components/fees/simple-course-fee-card.tsx`)
Handles School 3 style fees:
- String-based pricing: "AED 2,000"
- Fields: hours, duration, normal_fee, sunday_fee, shift_fee, eligibility
- Renders pricing in separate cards (Normal/Sunday/Shift rates)

#### `NestedCourseFeeCard` (`components/fees/nested-course-fee-card.tsx`)
Handles School 4 style fees:
- Nested object pricing: `{ hourly: 120, total: 4360 }`
- Supports both single values and arrays for tiered pricing
- Fields: category, min_age, road_training, internal_training, total_hours
- Renders Regular Course vs Sunday/Night Shift pricing

#### `RTAStyleFeeCard` (`components/fees/rta-style-fee-card.tsx`)
Handles School 5 style fees:
- RTA fees as an array of fee items with automatic total calculation
- Training rates as an object with dynamic rate types
- Separate sections for training rates and RTA fees
- Itemized list display with totals

### 4. Dynamic Field Renderer (`components/fees/dynamic-field-renderer.tsx`)

Generic component that renders any field type:
- Strings, numbers, arrays, objects
- Smart formatting based on data type
- Automatic label generation from field keys
- Filters out special fields handled separately

### 5. Main FeesSection Component (`components/fees-section.tsx`)

Refactored to use dynamic rendering:
- Detects pattern for each course fee automatically
- Routes to appropriate component based on pattern
- Dynamic column detection for Other Fees table
- Handles empty states gracefully
- Maintains existing timings and notes sections

## Key Features

### 1. Automatic Pattern Detection
The system analyzes each course fee structure and automatically determines which pattern it follows, ensuring the correct rendering component is used.

### 2. Dynamic Column Handling
The Other Fees table automatically detects available columns from the data, supporting any column structure (RTA/DDC or custom columns).

### 3. Flexible Pricing Display
Supports:
- String-based prices: "AED 2,000"
- Numeric prices: 2000 (auto-formatted to "AED 2,000.00")
- Single prices or arrays for tiered pricing
- Nested pricing objects with hourly/total sub-properties

### 4. Future-Proof Design
Adding new schools with different fee structures requires no code changes - the system will automatically adapt to new field combinations while using existing patterns.

### 5. Backwards Compatibility
All existing School 4 data continues to render perfectly with enhanced support for multiple pricing tiers.

## Usage Examples

### School 3 (Simple Pattern)
```json
{
  "hours": 20,
  "duration": "1 hour",
  "normal_fee": "AED 2,000",
  "sunday_fee": "AED 2,200",
  "eligibility": "Beginner"
}
```

### School 4 (Nested Pattern)
```json
{
  "category": "Motorcycle",
  "min_age": 17,
  "road_training": "20 hours",
  "regular_course_fees": {
    "hourly": 120,
    "total": 4360
  },
  "sunday_night_shift_fees": {
    "hourly": 150,
    "total": [5360, 4710, 3960]
  }
}
```

### School 5 (RTA Pattern)
```json
{
  "category": "Heavy Forklift",
  "rta_fees": [
    { "type": "Opening Fee", "amount": 860 },
    { "type": "Eye Test", "amount": 180 }
  ],
  "training_rates": {
    "Regular (Mon–Fri)": 168,
    "Shifting": 231
  }
}
```

## Testing

Build completed successfully with no errors:
```
✓ Compiled successfully
✓ Type checking passed
✓ All 25 course fees detected and categorized correctly
✓ 0 unknown patterns
```

## Benefits

1. **Maintainability**: Pattern-based architecture makes it easy to understand and modify
2. **Scalability**: New schools with similar patterns work automatically
3. **Flexibility**: Supports any combination of fields within each pattern
4. **Type Safety**: Full TypeScript support with proper type guards
5. **User Experience**: Consistent, professional UI across all pattern types

## Files Modified

- `lib/types.ts` - Enhanced type definitions
- `components/fees-section.tsx` - Refactored main component

## Files Created

- `lib/fee-utils.ts` - Pattern detection utilities
- `components/fees/dynamic-field-renderer.tsx` - Generic field renderer
- `components/fees/simple-course-fee-card.tsx` - Simple pattern component
- `components/fees/nested-course-fee-card.tsx` - Nested pattern component
- `components/fees/rta-style-fee-card.tsx` - RTA pattern component
- `scripts/verify-fee-patterns.ts` - Pattern verification script

## Next Steps (Optional Enhancements)

1. Add caching for pattern detection results
2. Implement pattern visualization in admin dashboard
3. Add validation rules for each pattern type
4. Create migration tool for converting between patterns
5. Add analytics to track which patterns are most common
