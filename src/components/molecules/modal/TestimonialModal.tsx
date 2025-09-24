import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/atomics/button";
import {
  usePostTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/services/testimonial.service";
import { Transaction } from "@/interfaces/transaction";
import { useToast } from "@/components/atomics/use-toast";
import Image from "next/image";

interface TestimonialModalProps {
  transaction: Transaction;
  userId: number | undefined;
  userName: string | undefined;
  onClose: (action?: "refetch" | "close") => void;
}

/* ---------- Star Rating (aksesibel) ---------- */
function StarRating({
  value,
  onChange,
  size = "text-2xl",
}: {
  value: number;
  onChange: (val: number) => void;
  size?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {stars.map((star) => {
          const active = (hover ?? value) >= star;
          return (
            <button
              key={star}
              type="button"
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(star)}
              onBlur={() => setHover(null)}
              onClick={() => onChange(star)}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              className={`select-none transition ${size} ${
                active ? "text-yellow-400" : "text-gray-300"
              }`}
            >
              ★
            </button>
          );
        })}
      </div>
      <span className="text-sm text-gray-500">{hover ?? value}/5</span>
    </div>
  );
}

/* ---------- Modal ---------- */
const TestimonialModal: React.FC<TestimonialModalProps> = ({
  transaction,
  userId,
  userName,
  onClose,
}) => {
  const { toast } = useToast();
  const userTestimonial = transaction.boarding_house?.testimonials?.find(
    (t) => t.user_id === userId
  );

  const [content, setContent] = useState(userTestimonial?.content || "");
  const [rating, setRating] = useState(userTestimonial?.rating || 5);
  const [charCount, setCharCount] = useState(content.length);
  const [justSent, setJustSent] = useState(false);

  const [
    postTestimonial,
    { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError },
  ] = usePostTestimonialMutation();
  const [
    updateTestimonial,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError },
  ] = useUpdateTestimonialMutation();

  const maxChars = 500;

  // sinkron saat userTestimonial berubah
  useEffect(() => {
    const c = userTestimonial?.content || "";
    const r = userTestimonial?.rating || 5;
    setContent(c);
    setRating(r);
    setCharCount(c.length);
  }, [userTestimonial]);

  // close via ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose("close");
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [onClose]);

  // success handler
  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      setJustSent(true);
      toast({
        title: "Thanks for your review!",
        description: "Testimonial has been saved successfully.",
      });
      const t = setTimeout(() => onClose("refetch"), 900);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateSuccess, isUpdateSuccess]);

  const isSubmitting = isCreating || isUpdating;

  const errorMessage = useMemo(() => {
    const apiErr = (createError as any)?.data || (updateError as any)?.data;
    if (!apiErr) return null;
    if (apiErr?.message) return apiErr.message;
    if (apiErr?.errors) {
      try {
        return Object.values(apiErr.errors).flat().join(" · ");
      } catch {
        return "Failed to submit testimonial.";
      }
    }
    return "Failed to submit testimonial.";
  }, [createError, updateError]);

  // overlay click close
  const overlayRef = useRef<HTMLDivElement>(null);
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose("close");
  };

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="
          w-full sm:max-w-lg
          rounded-t-2xl sm:rounded-2xl
          bg-white shadow-xl ring-1 ring-black/5
          translate-y-0 sm:animate-in sm:fade-in-0 sm:zoom-in-95
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {userTestimonial ? "Edit Testimonial" : "Give a Testimonial"}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {transaction.boarding_house?.name}
            </p>
          </div>
          <button
            onClick={() => onClose("close")}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5">
          {/* Property mini card (opsional, tetap minimal) */}
          <div className="mb-5 flex items-center gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200">
              <Image
                src={(() => {
                  const img = transaction.room?.images?.[0]?.image;
                  if (!img) return "/images/placeholder.webp";
                  // If starts with http(s) or /, use as is
                  if (/^(https?:\/\/|\/)/.test(img)) return img;
                  // Otherwise, use remote storage base url
                  return `${process.env.NEXT_PUBLIC_STORAGE_BASE_URL}/${img}`;
                })()}
                alt="Room"
                width={48}
                height={48}
                className="h-12 w-12 object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-gray-900">
                {transaction.room?.name ?? "-"}
              </div>
              <div className="truncate text-xs text-gray-500">
                {transaction.boarding_house?.address ?? "-"}
              </div>
            </div>
          </div>

          {/* Form */}
          {!justSent && (
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                // guard name
                const nameSafe = userName || "User";

                const currentTestimonial =
                  transaction.boarding_house?.testimonials?.find(
                    (t) => t.user_id === userId
                  );

                if (currentTestimonial) {
                  await updateTestimonial({
                    id: currentTestimonial.id,
                    boarding_house_id: transaction.boarding_house.id,
                    name: nameSafe,
                    content,
                    rating,
                  });
                } else {
                  await postTestimonial({
                    boarding_house_id: transaction.boarding_house.id,
                    name: nameSafe,
                    content,
                    rating,
                  });
                }
              }}
            >
              {/* Name (readonly) */}
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900 outline-none
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  value={userName || ""}
                  readOnly
                />
              </div>

              {/* Rating */}
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  Rating
                </label>
                <StarRating value={rating} onChange={setRating} />
              </div>

              {/* Testimonial */}
              <div className="grid gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    Testimonial
                  </label>
                  <span className="text-xs text-gray-400">
                    {charCount}/{maxChars}
                  </span>
                </div>
                <textarea
                  className="min-h-28 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none
                             placeholder:text-gray-400
                             focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  value={content}
                  onChange={(e) => {
                    const next = e.target.value.slice(0, maxChars);
                    setContent(next);
                    setCharCount(next.length);
                  }}
                  placeholder="Share your experience to help others…"
                  required
                  maxLength={maxChars}
                  rows={5}
                />
                <p className="text-xs text-gray-500">
                  Be honest and constructive. No sensitive info, please.
                </p>
              </div>

              {/* Error */}
              {errorMessage && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Actions */}
              <div className="mt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onClose("close")}
                  className="min-w-[96px]"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className="min-w-[140px]"
                >
                  {isSubmitting
                    ? "Saving…"
                    : userTestimonial
                    ? "Update Testimonial"
                    : "Send Testimonial"}
                </Button>
              </div>
            </form>
          )}

          {/* Success compact state (fallback, selain toast) */}
          {justSent && (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
                ✓
              </div>
              <div className="text-sm font-medium text-gray-900">
                Testimonial saved
              </div>
              <div className="text-xs text-gray-500">Closing in a moment…</div>
            </div>
          )}
        </div>

        {/* Footer (mobile-friendly back button) */}
        <div className="flex items-center justify-end gap-2 border-t px-5 sm:px-6 py-3">
          {!justSent && (
            <Button variant="ghost" onClick={() => onClose("close")}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;
