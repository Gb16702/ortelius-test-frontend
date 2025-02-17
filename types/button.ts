import type { ButtonHTMLAttributes, JSX } from "react"

export interface ButtonProperties extends ButtonHTMLAttributes<HTMLButtonElement> {
  additionalClasses?: string
  disabled?: boolean
  label: string
  loading?: boolean
  type: "button" | "reset" | "submit"
  variant: "default" | "disabled" | "custom"
  rightIcon?: JSX.Element | boolean
  onClick?: () => void
}

export interface ButtonVariantStyle {
  backgroundColor: string
  color: string
  hoverBackgroundColor?: string
  cursor?: string
}