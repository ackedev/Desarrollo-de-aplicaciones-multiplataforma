package ModelFils.Model;

public class Model {

    public void execute(){
        Resource resource = new Resource(0);
        Producer producer = new Producer(resource, 10000);
        Consumer consumer = new Consumer(resource, 10000);

        Thread h1 = new Thread(producer, "Producer");
        Thread h2 = new Thread(consumer, "Consumer");

        h1.start();
        h2.start();

        try {
            h1.join();
            h2.join();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return;
        }

        System.out.println(resource.getProduct());
    }   
}
