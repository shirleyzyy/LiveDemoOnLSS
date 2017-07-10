//
//  Defines.m
//  LiveDemo
//
//  Created by 白璐 on 16/8/10.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "Defines.h"

@implementation ResolutionHelper

+ (CGSize)size:(Resolution)resolution direction:(Direction)direction {
    CGSize size = CGSizeZero;
    switch (resolution) {
        case Resolution_1080P:
            size = CGSizeMake(1080, 1920);
            break;
        case Resolution_720P:
            size = CGSizeMake(720, 1280);
            break;
        case Resolution_480P:
            size = CGSizeMake(480, 640);
            break;
        case Resolution_360P:
            size = CGSizeMake(360, 480);
            break;
    }
    
    if (direction == DirectionLandscape) {
        size = CGSizeMake(size.height, size.width);
    }
    
    return size;
}

@end


@implementation BitrateHelper

+ (NSUInteger)bitrate:(Resolution)resolution {
    switch (resolution) {
        case Resolution_1080P:
            return 2000 * 1000;
        case Resolution_720P:
            return 1200 * 1000;
        case Resolution_480P:
            return 800 * 1000;
        case Resolution_360P:
            return 600 * 1000;
    }
}

@end
