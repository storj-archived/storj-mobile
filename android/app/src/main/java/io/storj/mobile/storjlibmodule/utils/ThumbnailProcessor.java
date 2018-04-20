package io.storj.mobile.storjlibmodule.utils;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;

import io.storj.mobile.storjlibmodule.dataprovider.repositories.FileRepository;
import io.storj.mobile.storjlibmodule.responses.Response;
import io.storj.mobile.storjlibmodule.responses.SingleResponse;

/**
 * Created by Crawter on 03.04.2018.
 */

public class ThumbnailProcessor {
    private final FileRepository _fileRepo;
    private final int THUMBNAIL_SIZE = 64;

    public ThumbnailProcessor(FileRepository fRepository) {
        _fileRepo = fRepository;
    }

    public SingleResponse getThumbbnail(String fileId, String filePath) {
        byte[] imageData = null;
        SingleResponse errorResult = new SingleResponse(false, "", "Unable to process thumbnail");

        try(ByteArrayOutputStream baos = new ByteArrayOutputStream();
            FileInputStream fis = new FileInputStream(filePath)) {

            Bitmap imageBitmap = BitmapFactory.decodeStream(fis);

            imageBitmap = Bitmap.createScaledBitmap(imageBitmap, THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);
            imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            imageData = baos.toByteArray();

            String encoded = Base64.encodeToString(imageData, Base64.DEFAULT);

            Response updateResult = _fileRepo.updateThumbnail(fileId, encoded);

            if(updateResult.isSuccess()) {
                return new SingleResponse(true, encoded, null);
            }
        }
        catch(Exception ex) {
            Log.d("THUMBNAIL_PROCESS_ERROR", ex.getMessage());
        }

        return errorResult;
    }

    public SingleResponse getThumbbnail(String filePath) {
        byte[] imageData = null;
        SingleResponse errorResult = new SingleResponse(false, "", "Unable to process thumbnail");

        try(FileInputStream fis = new FileInputStream(filePath);
            ByteArrayOutputStream baos = new ByteArrayOutputStream())
        {
            Bitmap imageBitmap = BitmapFactory.decodeStream(fis);

            imageBitmap = Bitmap.createScaledBitmap(imageBitmap, THUMBNAIL_SIZE, THUMBNAIL_SIZE, false);

            imageBitmap.compress(Bitmap.CompressFormat.JPEG, 100, baos);
            imageData = baos.toByteArray();

            String encoded = Base64.encodeToString(imageData, Base64.DEFAULT);

            return new SingleResponse(true, encoded, null);
        }
        catch(Exception ex) {
            Log.d("THUMBNAIL_PROCESS_ERROR", ex.getMessage());
        }

        return errorResult;
    }
}
