import React, { useState, useEffect } from "react";
import { Button } from "@/components/atomics/button";
import {
  usePostTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/services/testimonial.service";
import { Transaction } from "@/interfaces/transaction";
import { useToast } from "@/components/atomics/use-toast";

interface TestimonialModalProps {
  transaction: Transaction;
  userId: number | undefined;
  userName: string | undefined;
  onClose: (action?: "refetch" | "close") => void;
}

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`cursor-pointer text-2xl ${
          star <= value ? "text-yellow-400" : "text-gray-300"
        }`}
        onClick={() => onChange(star)}
      >
        ★
      </span>
    ))}
  </div>
);

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
  const [
    postTestimonial,
    { isLoading: isCreating, isSuccess: isCreateSuccess, error: createError },
  ] = usePostTestimonialMutation();
  const [
    updateTestimonial,
    { isLoading: isUpdating, isSuccess: isUpdateSuccess, error: updateError },
  ] = useUpdateTestimonialMutation();

  useEffect(() => {
    setContent(userTestimonial?.content || "");
    setRating(userTestimonial?.rating || 5);
  }, [userTestimonial]);

  useEffect(() => {
    if (isCreateSuccess || isUpdateSuccess) {
      toast({
        title: "Testimonial berhasil dikirim!",
        description: "Terima kasih atas ulasan Anda.",
      });
      // Hanya trigger sekali, reset state setelah toast
      setTimeout(() => {
        onClose("refetch");
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreateSuccess, isUpdateSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-0 w-full max-w-md relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl"
          onClick={() => onClose("close")}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-xl font-bold mb-4">Beri Testimonial</h2>
          {isCreateSuccess || isUpdateSuccess ? (
            <div className="text-green-600 font-semibold">
              Testimonial berhasil dikirim!
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                // Cek testimonial user fresh dari data transaction
                const currentTestimonial =
                  transaction.boarding_house?.testimonials?.find(
                    (t) => t.user_id === userId
                  );
                if (currentTestimonial) {
                  await updateTestimonial({
                    id: currentTestimonial.id,
                    boarding_house_id: transaction.boarding_house.id,
                    name: userName || "",
                    content,
                    rating,
                  });
                } else {
                  await postTestimonial({
                    boarding_house_id: transaction.boarding_house.id,
                    name: userName || "",
                    content,
                    rating,
                  });
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block mb-1 font-medium">Nama</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-100"
                  value={userName || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Testimonial</label>
                <textarea
                  className="w-full border rounded px-3 py-2"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? "Mengirim..."
                  : userTestimonial
                  ? "Edit Testimonial"
                  : "Kirim Testimonial"}
              </Button>
              {(createError || updateError) && (
                <div className="text-red-600">Gagal mengirim testimonial.</div>
              )}
            </form>
          )}
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => onClose("close")}
          >
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialModal;
