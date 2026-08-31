
export default function ErrorMessage({ message, title = "Error" }: { message: string; title?: string }) {

  return (
    <div role="alert" className="mb-4 rounded border border-red-300 bg-red-50 p-4 text-red-800">
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{message}</p>
    </div>
  );
}
