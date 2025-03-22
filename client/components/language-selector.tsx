"use client"

import { useLanguage } from "@/context/language-context"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline-block">{t("language.select")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={language === "en" ? "font-bold" : ""}>{t("language.english")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("hi")}>
          <span className={language === "hi" ? "font-bold" : ""}>{t("language.hindi")}</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("mr")}>
          <span className={language === "mr" ? "font-bold" : ""}>{t("language.marathi")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

