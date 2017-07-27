//
//  ZYLiveBackGroundView.m
//  LiveDemo
//
//  Created by zhaoyuanyuan on 2017/6/26.
//  Copyright © 2017年 zhaoyuanyuan. All rights reserved.
//

#import "ZYLiveBackGroundViewManager.h"
#import "ZYBackView.h"
#import "Defines.h"
#import "SettingViewModel.h"
#import "StreamingViewModel.h"
#import <VideoCore/VideoCore.h>

@interface ZYLiveBackGroundViewManager()<VCSessionDelegate>

//方法一：调用demo的ViewModel
@property(nonatomic, strong) StreamingViewModel* model;
@property (assign, nonatomic) BOOL isBacking;
@property(nonatomic, strong) ZYBackView *test;
//方法二：直接调用SDK
///**
// *  @brief 百度SDK调用中介
// */
//@property(nonatomic, strong) VCSimpleSession* session;
//
///**
// *  @brief 推流地址
// */
//@property(nonatomic, copy) NSString* url;
//
///**
// *  @brief 分辨率
// */
//@property(nonatomic, assign) Resolution resolution;
//
///**
// *  @brief 方向
// */
//@property(nonatomic, assign) Direction direction;
//
///**
// *  @brief 美颜
// */
//@property(nonatomic, assign) BOOL beautyEnabled;

@end

@implementation ZYLiveBackGroundViewManager

RCT_EXPORT_MODULE()
- (UIView *)view{
    NSLog(@"调用view");
    return self.test;
}

/*--------- Export methods -----------*/
RCT_EXPORT_METHOD(start:(NSString *)url resolution:(NSString*)resolution direction:(NSString*)direction){
    NSLog(@"调用成功,url:%@ ,分辨率:%@ ,方向:%@",url,resolution,direction);
    //设置session的参数，即将选择的上述参数设置好
    
    SettingViewModel *setVM = [[SettingViewModel alloc] init];
    setVM.url = url;
    setVM.resolution = (Resolution)resolution.intValue;
    setVM.direction = (Direction)direction.intValue;
    
    self.model = [[StreamingViewModel alloc] initWithSettingViewModel:setVM];
    
    [self.model setupSession:[self cameraOrientation] delegate:self];
    
    self.test = [[ZYBackView alloc] init];
    self.test.frame = CGRectMake(0, 0, [UIScreen mainScreen].bounds.size.width, [UIScreen mainScreen].bounds.size.height);
    [self.model preview:self.test];
    
//    [self.model preview:self.view];
    [self.model updateFrame:self.test];
}

- (AVCaptureVideoOrientation)cameraOrientation {
    return AVCaptureVideoOrientationPortrait;
}

#pragma mark - action

RCT_EXPORT_METHOD(onBack) {
    NSLog(@"onBack");
    self.isBacking = YES;
    BOOL result = [self.model back];
}

RCT_REMAP_METHOD(onToggleFlash,
                 onToggleFlashWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"onToggleFlash");
    BOOL toggle = [self.model toggleTorch];
    if (toggle) {
        resolve(@"开启闪光灯成功");
    } else {
        NSError *error = [NSError errorWithDomain:@"native error" code:1 userInfo:nil];
        reject(@"failed",@"开启闪光灯失败",error);
    }
}

RCT_EXPORT_METHOD(onSwitchCamera) {
    NSLog(@"onSwitchCamera");
    [self.model switchCamera];
}

RCT_REMAP_METHOD(onBeauty,
                  onBeautyWithResolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
    NSLog(@"onBeauty");
    BOOL toggle = [self.model toggleBeauty];
    if (toggle) {
        resolve(@"美颜成功");
    } else {
        NSError *error = [NSError errorWithDomain:@"native error" code:1 userInfo:nil];
        reject(@"failed",@"美颜失败",error);
    }
}

RCT_REMAP_METHOD(onToggleStream,onToggleStreamWithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
    NSLog(@"onToggleStream");
    BOOL toggle = [self.model toggleStream];
    if (toggle) {
        resolve(@"推流成功");
    } else {
        NSError *error = [NSError errorWithDomain:@"native error" code:1 userInfo:nil];
        reject(@"failed",@"推流失败",error);
    }
}

RCT_EXPORT_METHOD(onPinch) {
    NSLog(@"onPinch");
//    [self.model pinch:self.pinchGesture.scale state:self.pinchGesture.state];
}

RCT_EXPORT_METHOD(onTap) {
    NSLog(@"onTap");
//    CGPoint point = [self.tapGesture locationInView:self.view];
//    point.x /= self.view.frame.size.width;
//    point.y /= self.view.frame.size.height;
    
//    [self.model setInterestPoint:point];
}

RCT_EXPORT_METHOD(onDoubleTap) {
    NSLog(@"onDoubleTap");
    [self.model zoomIn];
}


#pragma mark - VCSessionDelegate
- (void) connectionStatusChanged: (VCSessionState) sessionState {
    switch(sessionState) {
        case VCSessionStatePreviewStarted:
            break;
        case VCSessionStateStarting:
            NSLog(@"Current state is VCSessionStateStarting\n");
            break;
        case VCSessionStateStarted:
            NSLog(@"Current state is VCSessionStateStarted\n");
            break;
        case VCSessionStateError:
            NSLog(@"Current state is VCSessionStateError\n");
            break;
        case VCSessionStateEnded:
            NSLog(@"Current state is VCSessionStateEnded\n");
            break;
        default:
            break;
    }
}


@end
