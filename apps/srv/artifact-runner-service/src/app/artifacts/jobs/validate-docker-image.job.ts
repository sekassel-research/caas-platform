import * as Docker from 'dockerode';

export class DockerJob {
    
    private docker = new Docker({host: 'http://127.0.0.1', port: 2375});
    
    constructor() {}

    async pullImage(repoTag){
        this.docker.pull(repoTag, (err, stream) => {
            if (err) {
                console.error("Docker pull failed for: " + repoTag + " error: " + err)
            } else {
              console.log("Docker pull successful for: " + repoTag)
            }
        });
    }
  
    async listRunningContainers(){
      this.docker.listContainers(function (err, containers) {
          console.log(containers)
            if (err) {
                console.error("Docker listContainers failed" + " error: " + err)
            }
        });
    }
  
    async createAndStartContainer(repoTag, options){
      this.docker.createContainer({ Image: repoTag, Tty: false, name: 'HelloWorld', options}, function (err,container){
      if (err) {
            console.error("Docker listContainers failed" + " error: " + err)
        }
        container.start();
      });
    }
}
