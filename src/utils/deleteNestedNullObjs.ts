/**
 *  @description delete object with null value
 * @param con An array containing 'null' values that needs getting rid of
 * @returns A new array with none 'null/empty' values
 */
 export const deleteNestedNullObj = (con: any) => {
    let _new: any = []
    Object.keys(con)?.forEach((key) => {
      if (con[key] && typeof con[key] === 'object') _new.push(con[key])
    })
    return _new
  }