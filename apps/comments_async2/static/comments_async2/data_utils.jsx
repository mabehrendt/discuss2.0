import {cyrb53} from "./utils";
import api from "../../../../adhocracy-plus/static/api";

function addCreatorData(urlReplaces, props){
    console.log(props)
    console.log("CREATOR: " + props.user.user)
    console.log("HASH: " + cyrb53(props.user.user))
     const stanceData = {
        urlReplaces: urlReplaces,
        content_type: props.subjectType,
        object_id: props.subjectId,
        creator: props.user.user,
        creator_id : cyrb53(props.user.user)
      }
      api.userqualities.add(stanceData)
}

export {addCreatorData}
