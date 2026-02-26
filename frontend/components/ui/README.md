# UI Components

This directory contains the base Shadcn/ui components and custom components for the Influencer Campaign Tracker application.

## Installed Components

### Base Shadcn/ui Components

- **Button**: Primary, secondary, outline, destructive, ghost, and link variants
- **Card**: Container component with header, content, and footer sections
- **Input**: Text input with validation states
- **Label**: Form label component
- **Badge**: Small status indicators with multiple variants
- **Table**: Data table with header, body, and footer sections

### Custom Components

- **StatusBadge**: Color-coded status badges for campaigns, workflows, and payments

## Usage Examples

### Button

```tsx
import { Button } from "@/components/ui"

// Primary button
<Button>Click me</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Destructive button
<Button variant="destructive">Delete</Button>

// Outline button
<Button variant="outline">Cancel</Button>

// With icon
<Button>
  <PlusIcon />
  Add Campaign
</Button>
```

### Card

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui"

<Card>
  <CardHeader>
    <CardTitle>Campaign Title</CardTitle>
    <CardDescription>Campaign description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Input & Label

```tsx
import { Input, Label } from "@/components/ui"

<div>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter your email" />
</div>
```

### Badge

```tsx
import { Badge } from "@/components/ui"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### StatusBadge

```tsx
import { StatusBadge } from "@/components/ui"

// Campaign statuses
<StatusBadge status="draft">Draft</StatusBadge>
<StatusBadge status="active">Active</StatusBadge>
<StatusBadge status="completed">Completed</StatusBadge>

// Workflow statuses
<StatusBadge status="invited">Invited</StatusBadge>
<StatusBadge status="accepted">Accepted</StatusBadge>
<StatusBadge status="submitted">Submitted</StatusBadge>
<StatusBadge status="verified">Verified</StatusBadge>
<StatusBadge status="paid">Paid</StatusBadge>

// Payment statuses
<StatusBadge status="pending">Pending</StatusBadge>
```

### Table

```tsx
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui"

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Campaign 1</TableCell>
      <TableCell><StatusBadge status="active">Active</StatusBadge></TableCell>
      <TableCell>$1,000</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## Design System

### Color Mapping

**Status Badge Colors:**
- **Draft/Invited**: Gray (`#9CA3AF`)
- **Active/Accepted**: Blue (`#3B82F6`)
- **Submitted/Pending**: Amber (`#F59E0B`)
- **Verified**: Emerald (`#10B981`)
- **Paid/Completed**: Dark Emerald (`#059669`)

### Component Specifications

**Button:**
- Padding: `px-4 py-2`
- Border radius: `rounded-md`
- Transition: 150ms ease
- Focus ring: 3px ring with primary color

**Card:**
- Background: White
- Border: 1px solid border color
- Shadow: `shadow-sm`
- Padding: `p-6`
- Border radius: `rounded-xl`

**StatusBadge:**
- Padding: `px-3 py-1`
- Border radius: `rounded-full`
- Font: `text-xs font-medium`
- Color-coded by status

**Table:**
- Hover: Light background on rows
- Border: Bottom border on rows
- Padding: `p-2` for cells
- Sticky header support

## Customization

All components support className prop for custom styling:

```tsx
<Button className="w-full">Full Width Button</Button>
<Card className="max-w-md">Narrow Card</Card>
<StatusBadge status="active" className="text-sm">Larger Badge</StatusBadge>
```

## Accessibility

All components follow accessibility best practices:
- Proper ARIA attributes
- Keyboard navigation support
- Focus visible states
- Screen reader friendly
- Semantic HTML elements
