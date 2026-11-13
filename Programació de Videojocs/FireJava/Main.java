import javax.swing.SwingUtilities;

import src.model.IModel;
import src.model.Model;
import src.presenter.IPresenter;
import src.presenter.Presenter;
import src.view.IView;
import src.view.View;

public class Main {
    public static void main (String[] args) {
        SwingUtilities.invokeLater(() -> {
                IModel IModel = new Model();
                IView IView = new View();
                IPresenter presenter = new Presenter (IModel, IView);

                //Ejecución total
                presenter.start();

        });
    }
}
