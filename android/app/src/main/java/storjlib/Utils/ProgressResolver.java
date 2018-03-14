package storjlib.Utils;

/**
 * Created by Yaroslav-Note on 3/13/2018.
 */

public class ProgressResolver {
    private double mProgress;

    public void setMProgress(double progress) {
        if(progress - mProgress > 0.02) {
            mProgress = progress;
        }
    }

    public double getMProgress() {
        return mProgress;
    }
}
