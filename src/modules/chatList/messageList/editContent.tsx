import { forwardRef, useImperativeHandle, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const EditContent = forwardRef<{}, { content: string }>(
  ({ content }, forwardedRef) => {
    const [open, setOpen] = useState(false)

    useImperativeHandle(forwardedRef, () => ({
      open: () => {
        console.log('open')
      },
    }))

    return (
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {/* <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input id="username" value="@peduarte" className="col-span-3" />
            </div>
          </div> */}
          <DialogFooter>
            {/* <Button type="submit">Save changes</Button> */}
            <div>button</div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  },
)
