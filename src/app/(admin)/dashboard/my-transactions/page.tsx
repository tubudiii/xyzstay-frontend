import dynamic from "next/dynamic";

const ClientMyTransactions = dynamic(
  () => import("./ClientMyTransactions").then((mod) => mod.default),
  { ssr: false }
);

export default function Page() {
  return <ClientMyTransactions />;
}
