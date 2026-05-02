"use client";

import { useI18n } from "@/lib/i18n-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface SessionExpiredDialogProps {
  open: boolean;
  onSignIn: () => void;
}

export function SessionExpiredDialog({
  open,
  onSignIn,
}: SessionExpiredDialogProps) {
  const { t } = useI18n();

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="max-w-md"
      >
        <DialogHeader>
          <DialogTitle>{t("session.expired.title")}</DialogTitle>
          <DialogDescription>
            {t("session.expired.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:flex-col">
          <Button onClick={onSignIn} size="lg" className="w-full">
            {t("session.signInAgain")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
