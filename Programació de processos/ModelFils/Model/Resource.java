package ModelFils.Model;

public class Resource {
    private int product;

    public Resource(int initialProduct){
        this.product = initialProduct;
    }

    public synchronized void consumeProduct(){
        product--;
    }

    public synchronized void generateNewProduct(){
        product++;
    }

    public int getProduct(){
        return product;
    }
}
