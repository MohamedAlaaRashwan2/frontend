/**
 * Splits a line of text into words on the server, so headings can be revealed word by word without a client-side split,
 * a flash of unsplit text or a layout shift. Works in Server and Client Components.
 *
 * Only ever splits on whitespace: an Arabic word stays one unit, so its letters keep joining and its punctuation stays
 * attached. The spaces remain real text, so copying, line wrapping and screen readers behave as for plain text.
 */
export function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        part.trim() === "" ? (
          part
        ) : (
          <span key={i} className="w">
            <span className="wi">{part}</span>
          </span>
        ),
      )}
    </>
  );
}
