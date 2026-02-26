import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Badge,
  StatusBadge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui"
import { PlusIcon, TrashIcon } from "lucide-react"

export default function ComponentsDemo() {
  return (
    <div className="container mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">UI Components Demo</h1>
        <p className="text-muted-foreground">
          Shadcn/ui components for the Influencer Campaign Tracker
        </p>
      </div>

      {/* Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>Various button styles and variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button>Primary Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button disabled>Disabled</Button>
            <Button size="sm">Small</Button>
            <Button size="lg">Large</Button>
            <Button>
              <PlusIcon />
              With Icon
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Status Badges</CardTitle>
          <CardDescription>Color-coded status indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Campaign Statuses</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="draft">Draft</StatusBadge>
                <StatusBadge status="active">Active</StatusBadge>
                <StatusBadge status="completed">Completed</StatusBadge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Workflow Statuses</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="invited">Invited</StatusBadge>
                <StatusBadge status="accepted">Accepted</StatusBadge>
                <StatusBadge status="submitted">Submitted</StatusBadge>
                <StatusBadge status="verified">Verified</StatusBadge>
                <StatusBadge status="paid">Paid</StatusBadge>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Payment Statuses</h3>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status="pending">Pending</StatusBadge>
                <StatusBadge status="paid">Paid</StatusBadge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regular Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>General purpose badges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Form Inputs</CardTitle>
          <CardDescription>Input fields with labels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled Input</Label>
              <Input id="disabled" disabled placeholder="Disabled input" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Table</CardTitle>
          <CardDescription>Data table with status badges</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Influencers</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Summer Collection</TableCell>
                <TableCell>
                  <StatusBadge status="active">Active</StatusBadge>
                </TableCell>
                <TableCell>$5,000</TableCell>
                <TableCell>12</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm">
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Winter Launch</TableCell>
                <TableCell>
                  <StatusBadge status="draft">Draft</StatusBadge>
                </TableCell>
                <TableCell>$3,500</TableCell>
                <TableCell>8</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm">
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Spring Campaign</TableCell>
                <TableCell>
                  <StatusBadge status="completed">Completed</StatusBadge>
                </TableCell>
                <TableCell>$8,000</TableCell>
                <TableCell>20</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon-sm">
                    <TrashIcon />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Card Examples */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description goes here</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              This is a basic card with header and content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>With Footer</CardTitle>
            <CardDescription>Card with action footer</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Card content goes here.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Action</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Campaign metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">24</div>
            <p className="text-sm text-muted-foreground">Active campaigns</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
