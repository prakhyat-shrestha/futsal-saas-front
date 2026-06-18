"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface NotAuthorizedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotAuthorizedDialog({ open, onOpenChange }: NotAuthorizedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Not Authorized</DialogTitle>
          <DialogDescription>
            You are not authorized to perform this action. Please contact an administrator for assistance.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}