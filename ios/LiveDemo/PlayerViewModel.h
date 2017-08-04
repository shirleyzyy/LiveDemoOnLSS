//
//  PlayerViewModel.h
//  VideoPlayer
//
//  Created by 白璐 on 16/9/20.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

//#import "PlayerControlDelegate.h"

@protocol VideoSource;

@interface PlayerViewModel : NSObject 

//@property(nonatomic, weak) id<VideoSource> videoSource;
//@property(nonatomic, weak) id<PlayerActions> actions;

- (instancetype)initWithURL:(NSString*)url
                      title:(NSString*)title
               downloadable:(BOOL)downloadable;

- (void)layout:(UIView*)parent;
- (void)start;
- (void)stop;

@end
