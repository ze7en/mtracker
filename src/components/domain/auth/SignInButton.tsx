import { GithubAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'

export const SignInButton = () => {
  const handleClick = () => {
    const provider = new GithubAuthProvider()
    const auth = getAuth()

    // @see https://firebase.google.com/docs/auth/web/github-auth
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a GitHub Access Token. You can use it to access the GitHub API.
        const credential = GithubAuthProvider.credentialFromResult(result)
        // const token = credential?.accessToken

        // The signed-in user info.
        const user = result.user

        console.log('credentials', credential)
        console.log('github user', user)
      }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        const email = error.customData.email
        const credential = GithubAuthProvider.credentialFromError(error)

        console.log(':: error', errorCode, errorMessage, email, credential)
      })
  }

  return (
    <button
      onClick={ handleClick }
      type="button"
      className="btn btn-primary btn-sm normal-case"
    >
      Sign In With GitHub!
    </button>
  )
}
