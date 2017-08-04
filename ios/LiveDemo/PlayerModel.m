//
//  PlayerModel.m
//  VideoPlayer
//
//  Created by 白璐 on 16/9/20.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "PlayerModel.h"

@implementation PlayerModel

- (instancetype)initWithURL:(NSString*)url
                      title:(NSString*)title
               downloadable:(BOOL)downloadable {
    if (self = [super init]) {
        _url = url;
        _title = title;
        _downloadable = downloadable;
    }
    
    return self;
}
@end
