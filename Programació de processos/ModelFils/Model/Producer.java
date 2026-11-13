package ModelFils.Model;

public class Producer implements Runnable {
    private Resource resource;
    private int produced;
    
    public Producer(Resource resource, int produced){
        this.resource = resource;
        this.produced = produced;
    }
    @Override 
    public void run(){
        String threadName = Thread.currentThread().getName();

        for(int i = 0; i < produced; i++){
            resource.generateNewProduct();
        }

    }
}
