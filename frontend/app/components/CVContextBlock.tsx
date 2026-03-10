interface CVContextBlockProps {
  content: string;
}

export function CVContextBlock({ content }: CVContextBlockProps) {
  return (
    <section className="space-y-4">
      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] ml-2">
        Resume Section Used
      </h4>
      <div className="p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm text-gray-600 leading-relaxed font-medium overflow-y-auto">
        <p className="text-base leading-loose italic wrap-break-word">
          {content}
        </p>
      </div>
    </section>
  );
}
