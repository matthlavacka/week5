if (Meteor.isClient) {
  // On rendered template
  Template.terminal.onRendered(function () {

    $("#command").typed({
      strings: ["Welcome to Youtube Downloader.", "Paste link and press Enter to download.", "youtube.com/watch?v=WLGdXtZMmiI", "mixcloud.com/nicky-romero-protocol", "vid.me/MtIV", "twitch.tv/pokernighttv", "soundcloud.com/hucci/montana", "vimeo.com/71278954", "vevo.com/watch/justin-timberlake/Cry-Me-A-River", "youporn.com/amateur-couple-on-camera"],
      attr: "placeholder", //attribute
      typeSpeed: 30, // typing speed
      startDelay: 100, // time before typing starts
      backSpeed: 2, // backspacing speed
      backDelay: 300, // pause before backspacing
      loop: true, // loop on or off (true or false)
      loopCount: false, // number of loops, false = infinite
      showCursor: true, // show cursor
      callback: function(){ } // call function after typing is done
    });
  });

  Template.terminal.events({
    'submit #command-input': function (event, template) {
      event.preventDefault();
      var input = template.find('#command');
      var cmd = input.value;
      console.log("command", cmd);
      Meteor.call('command', cmd, function(error, result) {
        if(result.stdout)
          console.log("Output: " + result.stdout);

        else
          console.log("Error: " + result.stderr);
      });
      input.value = "";
      input.focus();
    }
  });
}

if (Meteor.isServer) {
  // load exec
  var exec = Meteor.npmRequire('child_process').exec;
  // load future from fibers
  var Future = Meteor.npmRequire("fibers/future");
  
  Meteor.methods({
    'command' : function(line) {
      console.log("In command method", line);
      // this method call won't return immediately, it will wait for the
      // asynchronous code to finish, so we call unblock to allow this client
      this.unblock();
      var future = new Future();

      exec("youtube-dl " + line, function(error, stdout, stderr) {
        console.log('Command Method', error, stdout, stderr);
         
        future.return({stdout: stdout, stderr: stderr});
      }); 
      
      return future.wait();
    }
  });
}