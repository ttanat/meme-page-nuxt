export default (context, inject) => {
  /*
    Can modify only one field in auth user, e.g. image
    Payload is object, key is field name, value is new value
  */
  inject("setUserField", payload => context.$auth.setUser(Object.assign({}, context.$auth.user, payload)))

  /*
    field is an array, either "moderating" or "subscriptions"
    Adds a new page object to an array then sets field in auth user to that array
  */
  inject("appendUserFieldArray", (field, page_to_add) => {
    // Populate array with data from auth user and page to add
    const new_array = [
      ...context.$auth.user[field]/*.map(page => Object.fromEntries(Object.entries(page)))*/,
      page_to_add
    ]
    // Object key name comes from variable so must do this
    const new_field = {}
    new_field[field] = new_array

    context.$auth.setUser(Object.assign({}, context.$auth.user, new_field))
  })

  /*
    field is an array, either "moderating" or "subscriptions"
    Removes page object with matching name from field in auth user
  */
  inject("popUserFieldArray", (field, name) => {
    // New array without removed page
    const new_array = context.$auth.user[field].filter(page => page.name !== name)
    const new_field = {}
    new_field[field] = new_array
    context.$auth.setUser(Object.assign({}, context.$auth.user, new_field))
  })
}
