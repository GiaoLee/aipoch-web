import { filterRecords, litqa, sqa } from './benchmark-results'

const officialLogs =
  'https://huggingface.co/datasets/allenai/asta-bench-submissions/tree/main/1.0.0-dev1/test/'

export function RecordsTable({ kind }: { kind: 'litqa' | 'sqa' }) {
  const isLitqa = kind === 'litqa'
  const records = filterRecords(isLitqa ? litqa : sqa, isLitqa ? 'test' : 'all')
  return (
    <table className="tbl" id={`tbl-${kind}`}>
      <caption className="sr-only">
        {isLitqa ? 'LitQA2 official test records' : 'ScholarQA-CS2 all records'}
      </caption>
      <thead>
        <tr>
          {(isLitqa
            ? ['Rank', 'Agent', 'Models', 'Recall@30', 'USD / question', 'Date', 'Source']
            : ['#', 'Agent', 'Model', 'Score', 'Split']
          ).map((label) => (
            <th key={label} scope="col">
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {records.map((record, index) => {
          const rank = 1 + records.filter((other) => other.score - record.score > 0.000001).length
          const tied =
            records.filter((other) => Math.abs(other.score - record.score) < 0.000001).length > 1
          return (
            <tr key={record.id} className={record.group === 'aipoch' ? 'me' : undefined}>
              <td>{isLitqa ? `${tied ? 'T' : ''}${rank}` : index + 1}</td>
              <td>{record.system}</td>
              <td className="mdl">{record.model}</td>
              <td className="num">
                {record.score.toFixed(isLitqa ? 2 : 4)}
                {isLitqa ? '%' : ''}
                {isLitqa && record.group === 'aipoch' ? ' (68/75)' : ''}
              </td>
              {isLitqa ? (
                <>
                  <td className="num">
                    {record.cost === undefined ? '—' : `$${record.cost.toFixed(3)}`}
                  </td>
                  <td className="num">{record.date ?? '—'}</td>
                  <td>
                    {record.group === 'aipoch' ? (
                      'Local run'
                    ) : record.log ? (
                      <a
                        href={`${officialLogs}${record.log}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Official log
                      </a>
                    ) : (
                      'Official record'
                    )}
                  </td>
                </>
              ) : (
                <td>{record.source === 'val' ? 'Validation, 100 q. · local' : 'Official test'}</td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
