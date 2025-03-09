"use client"

export function Editor({ content = "", onChange = () => {}, placeholder = "Введіть текст..." }) {
  return (
    <div className="border rounded-md p-4">
      <textarea
        className="w-full min-h-[200px] resize-y focus:outline-none"
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export default Editor

