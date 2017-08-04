//
//  PlayerModel.h
//  VideoPlayer
//
//  Created by 白璐 on 16/9/20.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PlayerModel : NSObject

@property(nonatomic, copy) NSString* url;
@property(nonatomic, copy) NSString* title;
@property(nonatomic, assign) BOOL downloadable;

- (instancetype)initWithURL:(NSString*)url
                      title:(NSString*)title
               downloadable:(BOOL)downloadable;
@end
