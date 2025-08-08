"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props} className="bg-white border-gray-200 shadow-lg rounded-lg">
            <div className="grid gap-1">
              {title && <ToastTitle className="text-gray-800 font-semibold">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="text-gray-600">{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose className="text-gray-600 hover:text-blue-600" />
          </Toast>
        )
      })}
      <ToastViewport className="p-4" />
    </ToastProvider>
  )
}