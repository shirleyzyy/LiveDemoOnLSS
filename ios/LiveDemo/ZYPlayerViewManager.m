//
//  ZYPlayerViewManager.m
//  LiveDemo
//
//  Created by zhaoyuanyuan on 2017/7/28.
//  Copyright © 2017年 zhaoyuanyuan. All rights reserved.
//

#import "ZYPlayerViewManager.h"
#import "ZYBackView.h"
#import "PlayerViewModel.h"
#import <BDCloudMediaPlayer/BDCloudMediaPlayer.h>
#import <AVFoundation/AVAudioSession.h>
//#import <RongIMLib/RongIMLib.h>
//#import <CommonCrypto/CommonDigest.h>
#import "IMCloud.h"
@interface ZYPlayerViewManager ()
@property (nonatomic,strong) UIView *playView;
@property (nonatomic,strong) ZYBackView *test;
@property (nonatomic,strong) PlayerViewModel *viewModel;
//@property (nonatomic,strong) RCUserInfo *loginUser;
//@property(nonatomic, strong) BDCloudMediaPlayerController* player;
@end

@implementation ZYPlayerViewManager

RCT_EXPORT_MODULE()
- (UIView *)view{
    NSLog(@"调用ZYPlayerViewManager");
//    return self.test;
    return self.playView;
}

RCT_EXPORT_METHOD(start:(NSString *)url){
    
        [[BDCloudMediaPlayerAuth sharedInstance] setAccessKey:@"724c9abc6cd9403daece9d4d17c3e31b"];
    //    [BaiduAPM startWithApplicationToken:@"de0b9578cf3741b99df94a81d1ee4780"];
    
        AVAudioSession* session = [AVAudioSession sharedInstance];
        [session setCategory:AVAudioSessionCategoryPlayback withOptions:AVAudioSessionCategoryOptionDuckOthers error:nil];
        [session setActive:YES error:nil];
    
    
    NSLog(@"进入ZYPlayerViewManager Start url:%@",url);
    dispatch_async(dispatch_get_main_queue(), ^{
         [self startVideo:url];
    });
   
    self.playView = [[UIView alloc] init];
    self.playView.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    
}

RCT_EXPORT_METHOD(onBack){
    NSLog(@"停止播放，返回上一层");
    [self.viewModel stop];
}

- (void)startVideo:(NSString *)url{
    self.viewModel = [[PlayerViewModel alloc] initWithURL:@"http://hf8rads3r2zq4z8yuwm.exp.bcelive.com/lss-hf8rat3avr7vwekq/live.m3u8" title:@"测试" downloadable:NO];
    [self.viewModel start];
    [self.viewModel layout:self.playView];
    
}


@end
