export default async function({ params, redirect }) {
  redirect(301, `/user/${params.username}`)
}
