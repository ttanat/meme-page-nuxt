export default async function({ params, redirect }) {
  redirect(`/u/${params.username}`)
}
