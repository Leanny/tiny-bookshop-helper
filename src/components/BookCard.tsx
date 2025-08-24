import type { Book } from '../types'

const mainGenres = [
  'Book_Attribute_Crime',
  'Book_Attribute_Drama',
  'Book_Attribute_Fact',
  'Book_Attribute_Fantasy',
  'Book_Attribute_Classic',
  'Book_Attribute_Kids',
  'Book_Attribute_Travel',
]

export default function BookCard({ b }: { b: Book & { __t_title: string; __t_author: string; __t_attrs: string[] } }) {
  return (
    <article className='rounded-2xl border bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900' key={b.id}>
      <h3 className='font-semibold leading-snug'>{b.__t_title}</h3>
      <p className='text-sm opacity-70'>{b.__t_author}</p>
      <div className='mt-3 text-xs opacity-70'>
        {b.published && <span>Published: {b.published}</span>} {b.pages && <span> - {b.pages} pages</span>}
      </div>
      {(b.attributes.length > 0 || b.isFake) && (
        <div className='mt-3 flex flex-wrap gap-1'>
          {b.__t_attrs.map((a, i) => {
            const isMainGenre = b.mainGenres.map((c) => mainGenres[c]).includes(b.attributes[i])
            return (
              <span
                className={`px-2 py-0.5 rounded-full border text-xs dark:border-gray-700 ${
                  isMainGenre ? 'border-2 font-bold' : ''
                }`}
                key={a}
              >
                {a}
              </span>
            )
          })}
          {b.isFake > 0 && (
            <span className='px-2 py-0.5 rounded-full border border-red-500 text-red-500 text-xs'>Fake</span>
          )}
        </div>
      )}
    </article>
  )
}
