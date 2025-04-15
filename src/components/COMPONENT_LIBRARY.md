# Tribe Component Library

This document catalogs all reusable UI components in the Tribe app, their variants, props, and usage guidelines.

## Component Structure

Each component in our library follows a consistent pattern:

1. **Component File**: `ComponentName.tsx` with the component implementation
2. **Styles File**: Defined within the component file using StyleSheet
3. **Props Interface**: TypeScript interface defining all accepted props
4. **Documentation**: Usage examples and guidelines in this document
5. **Theme Integration**: Uses theme constants for all styling properties

## Common Components

### Button

**File**: `src/components/common/Button.tsx`

**Description**: Primary call-to-action component used throughout the app.

**Variants**:
- Primary (filled with primary color)
- Secondary (filled with secondary color)
- Outline (bordered, transparent background)
- Text (no border, no background)

**Props**:
```typescript
interface ButtonProps {
  title: string;                          // Button text
  onPress: () => void;                    // Press handler
  variant?: 'primary' | 'secondary' | 'outline' | 'text'; // Default: 'primary'
  size?: 'small' | 'medium' | 'large';    // Default: 'medium'
  disabled?: boolean;                     // Default: false
  loading?: boolean;                      // Shows loading indicator
  icon?: React.ReactNode;                 // Optional icon component
  iconPosition?: 'left' | 'right';        // Default: 'left'
  fullWidth?: boolean;                    // Default: false
  style?: StyleProp<ViewStyle>;           // Container style override
  textStyle?: StyleProp<TextStyle>;       // Text style override
}
```

**Usage Example**:
```jsx
// Primary button (default)
<Button 
  title="Sign In" 
  onPress={handleSignIn} 
/>

// Secondary button with loading state
<Button 
  title="Create Event"
  variant="secondary"
  loading={isSubmitting}
  onPress={handleCreateEvent} 
/>

// Small outline button with icon
<Button 
  title="Add Friend"
  variant="outline"
  size="small"
  icon={<Ionicons name="person-add" size={16} />}
  onPress={handleAddFriend}
/>
```

**Do's and Don'ts**:
- ✅ Use primary buttons for the main action on a screen
- ✅ Use outline or text buttons for secondary actions
- ✅ Keep button text concise and action-oriented
- ❌ Don't use multiple primary buttons on a single screen
- ❌ Don't use custom colors outside the theme

### Input

**File**: `src/components/common/Input.tsx`

**Description**: Text input field with consistent styling and behaviors.

**Variants**:
- Default (standard input)
- Password (with show/hide toggle)
- Multiline (for larger text entry)
- Search (with search icon and clear button)

**Props**:
```typescript
interface InputProps {
  value: string;                          // Input value
  onChangeText: (text: string) => void;   // Change handler
  placeholder?: string;                   // Placeholder text
  label?: string;                         // Input label
  error?: string;                         // Error message
  variant?: 'default' | 'password' | 'multiline' | 'search'; // Default: 'default'
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // Default: 'none'
  keyboardType?: KeyboardTypeOptions;     // Default: 'default'
  returnKeyType?: ReturnKeyTypeOptions;   // Default: 'done'
  maxLength?: number;                     // Max character length
  disabled?: boolean;                     // Default: false
  onSubmitEditing?: () => void;           // Submit handler
  onFocus?: () => void;                   // Focus handler
  onBlur?: () => void;                    // Blur handler
  leftIcon?: React.ReactNode;             // Left icon component
  rightIcon?: React.ReactNode;            // Right icon component
  containerStyle?: StyleProp<ViewStyle>;  // Container override
  inputStyle?: StyleProp<TextStyle>;      // Input style override
}
```

**Usage Example**:
```jsx
// Standard input with label
<Input
  label="Email Address"
  value={email}
  onChangeText={setEmail}
  placeholder="example@email.com"
  keyboardType="email-address"
  autoCapitalize="none"
  error={errors.email}
/>

// Password input
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  variant="password"
  error={errors.password}
/>

// Search input
<Input
  value={searchQuery}
  onChangeText={setSearchQuery}
  variant="search"
  placeholder="Search events..."
  returnKeyType="search"
  onSubmitEditing={handleSearch}
/>
```

**Do's and Don'ts**:
- ✅ Always provide meaningful labels and placeholders
- ✅ Add appropriate error messages for validation failures
- ✅ Use specific keyboard types for different inputs (email, number, etc.)
- ❌ Don't use inputs without validation for critical data
- ❌ Don't use custom styling that doesn't match theme

### Card

**File**: `src/components/common/Card.tsx`

**Description**: Container for grouped content with consistent styling.

**Variants**:
- Default (standard card)
- Elevated (with more prominent shadow)
- Outlined (with border instead of shadow)
- Interactive (with press handler and feedback)

**Props**:
```typescript
interface CardProps {
  children: React.ReactNode;              // Card content
  variant?: 'default' | 'elevated' | 'outlined' | 'interactive'; // Default: 'default'
  onPress?: () => void;                   // Press handler (required for interactive)
  style?: StyleProp<ViewStyle>;           // Container style override
  contentStyle?: StyleProp<ViewStyle>;    // Inner content style override
  testID?: string;                        // For testing
}
```

**Usage Example**:
```jsx
// Default card
<Card>
  <Text style={styles.title}>Event Details</Text>
  <Text style={styles.description}>{event.description}</Text>
</Card>

// Interactive card for events list
<Card 
  variant="interactive" 
  onPress={() => navigateToEvent(event.id)}
>
  <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
  <Text style={styles.eventTitle}>{event.title}</Text>
  <Text style={styles.eventDate}>{formatDate(event.dateTime)}</Text>
</Card>
```

**Do's and Don'ts**:
- ✅ Use cards to group related content
- ✅ Keep card content organized and concise
- ✅ Use interactive cards for items in lists that navigate elsewhere
- ❌ Don't nest cards within other cards
- ❌ Don't place too many actions within a single card

## Form Components

### FormField

**File**: `src/components/form/FormField.tsx`

**Description**: Wrapper for form inputs with consistent layout and error handling.

**Props**:
```typescript
interface FormFieldProps {
  label: string;                          // Field label
  error?: string;                         // Error message
  required?: boolean;                     // Is this field required?
  children: React.ReactNode;              // Form control (usually Input)
  helperText?: string;                    // Additional information
  containerStyle?: StyleProp<ViewStyle>;  // Container style override
}
```

**Usage Example**:
```jsx
// Basic form field with input
<FormField 
  label="Full Name" 
  required 
  error={errors.fullName}
>
  <Input
    value={fullName}
    onChangeText={setFullName}
    placeholder="Enter your full name"
  />
</FormField>

// Form field with helper text
<FormField 
  label="Username" 
  required 
  error={errors.username}
  helperText="Username must be unique and contain only letters, numbers, and underscores"
>
  <Input
    value={username}
    onChangeText={setUsername}
    placeholder="Choose a username"
    autoCapitalize="none"
  />
</FormField>
```

**Do's and Don'ts**:
- ✅ Use FormField to wrap all inputs in forms
- ✅ Clearly indicate required fields
- ✅ Provide specific, actionable error messages
- ❌ Don't create forms without validation
- ❌ Don't use inconsistent field layouts

## Profile Components

### ProfilePrompt

**File**: `src/components/profile/ProfilePrompt.tsx`

**Description**: Displays a user's answered prompt with interactions.

**Props**:
```typescript
interface ProfilePromptProps {
  promptText: string;                     // The prompt question
  answer: string;                         // User's answer
  likes?: number;                         // Number of likes
  onLike?: () => void;                    // Like handler
  onComment?: () => void;                 // Comment handler
  commentCount?: number;                  // Number of comments
  isEditable?: boolean;                   // Whether the prompt is editable
  onEdit?: () => void;                    // Edit handler
  style?: StyleProp<ViewStyle>;           // Container style override
}
```

**Usage Example**:
```jsx
// Display a prompt in read-only mode
<ProfilePrompt
  promptText="The one thing I want to know about you is..."
  answer="Whether you prefer mountains or beaches for vacation."
  likes={5}
  commentCount={2}
  onLike={handleLike}
  onComment={handleComment}
/>

// Editable prompt for current user's profile
<ProfilePrompt
  promptText="A life goal of mine is..."
  answer="To visit all seven continents before I turn 40."
  isEditable
  onEdit={handleEditPrompt}
  likes={12}
  commentCount={3}
  onLike={handleLike}
  onComment={handleComment}
/>
```

**Do's and Don'ts**:
- ✅ Display prompts consistently across profiles
- ✅ Show appropriate interactions based on whether user is viewing their own profile
- ✅ Keep prompt answers visible without truncation when possible
- ❌ Don't allow editing of other users' prompts
- ❌ Don't display empty prompts

## Event Components

### EventCard

**File**: `src/components/events/EventCard.tsx`

**Description**: Card displaying an event summary for lists and discovery.

**Props**:
```typescript
interface EventCardProps {
  id: string;                             // Event ID
  title: string;                          // Event title
  dateTime: Date | string;                // Event date and time
  location: string;                       // Event location
  imageUrl?: string;                      // Optional event image
  attendeeCount: number;                  // Number of attendees
  tags?: string[];                        // Event tags/categories
  distance?: number;                      // Distance from user (in km)
  onPress: (id: string) => void;          // Press handler
  variant?: 'vertical' | 'horizontal';    // Layout variant, default: 'vertical'
  style?: StyleProp<ViewStyle>;           // Container style override
}
```

**Usage Example**:
```jsx
// Vertical event card for grid view
<EventCard
  id={event.id}
  title={event.title}
  dateTime={event.dateTime}
  location={event.location}
  imageUrl={event.imageUrl}
  attendeeCount={event.attendeeCount}
  tags={event.tags}
  distance={event.distance}
  onPress={navigateToEventDetails}
/>

// Horizontal event card for list view
<EventCard
  id={event.id}
  title={event.title}
  dateTime={event.dateTime}
  location={event.location}
  imageUrl={event.imageUrl}
  attendeeCount={event.attendeeCount}
  variant="horizontal"
  onPress={navigateToEventDetails}
/>
```

**Do's and Don'ts**:
- ✅ Display the most important event information at a glance
- ✅ Use consistent date formatting across all event displays
- ✅ Optimize images for performance
- ❌ Don't overload cards with too much information
- ❌ Don't use different layouts for the same information in different screens

## Modal Components

### BottomSheet

**File**: `src/components/common/BottomSheet.tsx`

**Description**: Modal that slides up from the bottom of the screen.

**Props**:
```typescript
interface BottomSheetProps {
  isVisible: boolean;                     // Controls visibility
  onClose: () => void;                    // Close handler
  children: React.ReactNode;              // Sheet content
  title?: string;                         // Optional title
  snapPoints?: string[];                  // Height snap points (e.g. ['25%', '50%', '90%'])
  initialSnapIndex?: number;              // Initial snap point index
  disableBackdropPress?: boolean;         // Prevent closing on backdrop press
  style?: StyleProp<ViewStyle>;           // Container style override
}
```

**Usage Example**:
```jsx
// Basic bottom sheet with title
<BottomSheet
  isVisible={isFilterSheetVisible}
  onClose={closeFilterSheet}
  title="Filter Events"
>
  <EventFilters 
    filters={filters} 
    onApplyFilters={handleApplyFilters} 
    onReset={handleResetFilters}
  />
</BottomSheet>

// Bottom sheet with snap points
<BottomSheet
  isVisible={isDetailsVisible}
  onClose={closeDetails}
  snapPoints={['25%', '50%', '90%']}
  initialSnapIndex={1}
>
  <EventDetails eventId={selectedEventId} />
</BottomSheet>
```

**Do's and Don'ts**:
- ✅ Use bottom sheets for temporary, contextual interactions
- ✅ Include a clear way to dismiss the bottom sheet
- ✅ Keep content organized and scrollable if lengthy
- ❌ Don't nest multiple bottom sheets
- ❌ Don't use for critical, permanent actions that should have dedicated screens

---

This document will be continuously updated as new components are added to the library. 