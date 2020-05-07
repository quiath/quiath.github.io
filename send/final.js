
//if (window['__onGCastApiAvailable'] && typeof window['__onGCastApiAvailable'] === "function") 

let sav = window['__onGCastApiAvailable'];

window['__onGCastApiAvailable'] = function(isAvailable) {
  if (sav) {
      console.log("calling saved ", sav);
      sav(isAvailable);
  }
  //if (isAvailable) {
  //}
  console.log("__onGCastApiAvailable", isAvailable);
  if (isAvailable) {
        let player_local = videojs('my-video');

        console.log("ongcast remote", player_local.chromecastSessionManager && player_local.chromecastSessionManager.remotePlayer);
  }
};




//console.log("local", player_local);
//console.log("gp", gp);
//console.log("gpsm", gp.chromecastSessionManager && gp.chromecastSessionManager.remotePlayer);

let installed = false;
const MY_NAMESPACE = "urn:x-cast:com.kff.test";
const DBG_NAMESPACE = "urn:x-cast:com.google.cast.debuglogger";

function monitor() {
    if (!installed) {
        let player_local = videojs('my-video');
        console.log("trying install - remotePlayer", player_local.chromecastSessionManager && player_local.chromecastSessionManager.remotePlayer);

        if (player_local.chromecastSessionManager && player_local.chromecastSessionManager.remotePlayer) {

            let remotePlayerController = player_local.chromecastSessionManager.remotePlayerController;
            console.log("remotePlayerController", remotePlayerController); 
            remotePlayerController.addEventListener(
                cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
                function(ev) {
                     console.log("Remote Player event: IS_CONNECTED_CHANGED", ev);
                     console.log(remotePlayerController);

                     if (ev.field === "isConnected" && ev.value) {
                        
                        console.log("Installing message listener"); 
                        let castSession = cast.framework.CastContext.getInstance().getCurrentSession();    
                        castSession.addMessageListener(MY_NAMESPACE, function(channel, resp) {
                            console.log("Channel", channel, "Response", resp);
                        });

                        let pro=castSession.sendMessage(MY_NAMESPACE, {command: "test"});
                        console.log(pro);

                     }

                }
            );
            installed = true;
            console.log("Event listener install successful");


        }
    } else {
        setTimeout(monitor, 1000);
    }
}

setTimeout(
    monitor
, 1000);


function sendTest() {
    let castContext = cast.framework.CastContext.getInstance();
    if (castContext == null) {
        console.log("No cast context");
        return false;
    }
    let castSession = castContext.getCurrentSession();    
    if (castSession == null) {
        console.log("No cast session");
        return false;
    }
    let pro=castSession.sendMessage(MY_NAMESPACE, {command: "test"});
    console.log(pro);
    return false;
}

function sendShow(b) {
    return sendImpl("show", b);
}

function sendDbg(c) {
    return sendImpl(c, null, DBG_NAMESPACE);
}


function sendImpl(command, value = null, ns = MY_NAMESPACE) {
    let castContext = cast.framework.CastContext.getInstance();
    if (castContext == null) {
        console.log("No cast context");
        return false;
    }
    let castSession = castContext.getCurrentSession();    
    if (castSession == null) {
        console.log("No cast session");
        return false;
    }
    let pro=castSession.sendMessage(ns, {command, value});
    console.log(pro);
    return false;
}


