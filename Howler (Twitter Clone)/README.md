# Authenticated Howler

1. I had trouble making my JWT a valid token based on the standards from jwt.io. I struggled with getting my signature to verify as a valid signature, I figured out that the problem was that I was not also base64url encoding the signature, like the header and the payload.

2. One security risk is that the main and profile pages can be accessed through alteration of the frotend js code. The redirection of the html pages when the user is not logged in is all done on the fronted js. If a user inspects on the web browser, they can alter the source code to not redirect back to login.
