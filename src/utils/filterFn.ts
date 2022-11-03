import { matchSorter } from 'match-sorter'

export const filterFn = (data: any[], filterTerms: any, keys: any[]) => {
  if (!filterTerms.length) {
    return data
  }

//   const terms = filterTerms?.split(" ");
//     if (!terms || !(typeof terms === "object")) {
//         return data;
//     }

//   return matchSorter(data, terms, {
//     keys,
//     threshold: matchSorter.rankings.EQUAL,
//   })

  return filterTerms?.reduceRight(
    (results: Array<any>, term: string) => matchSorter(results, term, {
        keys,
        // threshold: matchSorter.rankings.EQUAL,
      }),
    data,
  )
}
