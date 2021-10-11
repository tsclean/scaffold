import {CleanFactory} from "clean-ts";
import {AppContainer} from "./app";
import {PORT} from "./config/environment";
    
async function init() {
    const app = await CleanFactory.create(AppContainer)
    await app.listen(PORT, () => console.log('Running on port ' + PORT))
}
   
init();