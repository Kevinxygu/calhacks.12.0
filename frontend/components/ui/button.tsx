import * as React from "react"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const classes = [
      "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
      variant === "default" ? "bg-palette-green text-white hover:bg-palette-green/90" : "",
      variant === "outline" ? "border border-white/20 text-white hover:bg-white/10" : "",
      variant === "ghost" ? "text-white hover:bg-white/10" : "",
      className ?? ""
    ].filter(Boolean).join(" ")

    return (
      <button className={classes} ref={ref} {...props} />
    )
  }
)
Button.displayName = "Button"

export { Button }