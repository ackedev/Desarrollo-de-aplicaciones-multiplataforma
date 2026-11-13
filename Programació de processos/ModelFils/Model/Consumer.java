package ModelFils.Model;

public class Consumer implements Runnable {
    private Resource resource;
    private int consumed;

    public Consumer(Resource resource, int consumed){
        this.resource = resource;
        this.consumed = consumed;
    }
    
    @Override 
    public void run(){
        String threadName = Thread.currentThread().getName();

        for(int i = 0; i < consumed; i++){
            resource.consumeProduct();
        }
    }
}
