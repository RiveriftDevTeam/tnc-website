/** Structured data for search engines and agents. Rendered once per page, in the body (Google reads both). */
export default function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
