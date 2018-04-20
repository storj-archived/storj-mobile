package io.storj.mobile.storjlibmodule;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

/**
 * <b>Copyright (C) One Eleven studio - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly
 * prohibited
 * Proprietary and confidential
 * Written by Bogdan Artemenko <artemenkobogdan@gmail.com> on  on 2/21/18.</b>
 */
public class GsonSingle {
private static Gson sInstanse;
public static Gson getInstanse(){
    if(sInstanse == null){
        // TODO: 2/21/18 Add more options for serializer/deserializer if needed
        sInstanse = new GsonBuilder()
                .excludeFieldsWithoutExposeAnnotation()
                .create();
    }
    return sInstanse;
}
}
