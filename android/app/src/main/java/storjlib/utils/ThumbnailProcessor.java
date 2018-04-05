package storjlib.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;

import storjlib.dataprovider.repositories.FileRepository;
import storjlib.responses.Response;
import storjlib.responses.SingleResponse;

/**
 * Created by Crawter on 03.04.2018.
 */

public class ThumbnailProcessor {
    private final FileRepository _fileRepo;

    public ThumbnailProcessor(FileRepository fRepository) {
        _fileRepo = fRepository;
    }

    public SingleResponse getThumbbnail(String fileId, String filePath) {
        byte[] imageData = null;
        SingleResponse errorResult = new SingleResponse(false, "", "Unable to process thumbnail");

        try
        {
            final int THUMBNAIL_SIZE = 64;

            FileInputStream fis = new FileInputStream(filePath);
            Bitmap imageBitmap = BitmapFactory.decodeStream(fis);

            imageBitmap = Bitmap.createScaledBitmap(imageBitmap, THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            imageData = baos.toByteArray();

            String encoded = Base64.encodeToString(imageData, Base64.DEFAULT);

            Response updateResult = _fileRepo.updateThumbnail(fileId, encoded);

            if(updateResult.isSuccess()) {
                return new SingleResponse(true, encoded, null);
            }
        }
        catch(Exception ex) {

        }

        return errorResult;
    }

    public SingleResponse getThumbbnail(String filePath) {
        byte[] imageData = null;
        SingleResponse errorResult = new SingleResponse(false, "", "Unable to process thumbnail");

        try
        {
            final int THUMBNAIL_SIZE = 64;

            FileInputStream fis = new FileInputStream(filePath);
            Bitmap imageBitmap = BitmapFactory.decodeStream(fis);

            imageBitmap = Bitmap.createScaledBitmap(imageBitmap, THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            imageData = baos.toByteArray();

            String encoded = Base64.encodeToString(imageData, Base64.DEFAULT);

            return new SingleResponse(true, encoded, null);
        }
        catch(Exception ex) {

        }

        return errorResult;
    }
}
