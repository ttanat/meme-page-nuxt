export default async function({ params, redirect }) {
  redirect(`/p/${params.name}`)
}
