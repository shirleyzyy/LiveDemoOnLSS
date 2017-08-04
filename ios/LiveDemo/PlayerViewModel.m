//
//  PlayerViewModel.m
//  VideoPlayer
//
//  Created by 白璐 on 16/9/20.
//  Copyright © 2016年 baidu. All rights reserved.
//

#import "PlayerViewModel.h"
#import "Defines.h"
#import "PlayerModel.h"
#import <BDCloudMediaPlayer/BDCloudMediaPlayer.h>

@interface PlayerViewModel ()
@property(nonatomic, strong) PlayerModel* model;
@property(nonatomic, strong) BDCloudMediaPlayerController* player;
@end

@implementation PlayerViewModel


- (instancetype)initWithURL:(NSString*)url
                      title:(NSString*)title
               downloadable:(BOOL)downloadable {
    if (self = [super init]) {
        _model = [[PlayerModel alloc] initWithURL:url
                                            title:title
                                     downloadable:downloadable];
        [self setupPlayer];
        [self setupNotifications];
    }
    
    return self;
}

- (void)dealloc {
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (void)layout:(UIView*)parent {
    if (![parent.subviews containsObject:self.player.view]) {
        [parent insertSubview:self.player.view atIndex:0];
    }
    
    self.player.view.frame = parent.bounds;
}

- (void)start {
    self.player.shouldAutoplay = YES;
    [self.player prepareToPlay];
    
//    [self.actions updateTitle:self.model.title];
//    [self.actions startLoadingAnimation];
//    
//    BOOL hasPrevious = [self.videoSource previousVideo:self.model.url] != nil;
//    BOOL hasNext = [self.videoSource nextVideo:self.model.url] != nil;
//    [self.actions updatePreviousState:hasPrevious];
//    [self.actions updateNextState:hasNext];
//    [self.actions updateDownoadable:self.model.downloadable];
}

- (void)stop{
    NSLog(@"播放器停止播放");
    [self.player stop];
}

#pragma mark - private methods

- (void)setupPlayer {
    self.player = [[BDCloudMediaPlayerController alloc] initWithContentString:self.model.url];
}

- (void)setupNotifications {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerPrepared:)
                                                 name:BDCloudMediaPlayerPlaybackIsPreparedToPlayNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerFinish:)
                                                 name:BDCloudMediaPlayerPlaybackDidFinishNotification
                                               object:nil];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerState:)
                                                 name:BDCloudMediaPlayerPlaybackStateDidChangeNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerBufferingStart:)
                                                 name:BDCloudMediaPlayerBufferingStartNotification
                                               object:nil];
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerBufferingUpdate:)
                                                 name:BDCloudMediaPlayerBufferingUpdateNotification
                                               object:nil];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerBufferingEnd:)
                                                 name:BDCloudMediaPlayerBufferingEndNotification
                                               object:nil];
    
    
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(onPlayerSeekCompleted:)
                                                 name:BDCloudMediaPlayerSeekCompleteNotification
                                               object:nil];
}

- (void)onPlayerPrepared:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
    
//    [self.actions stopLoadingAnimation];
//    [self.actions updateDuration:self.player.duration];
//    [self.actions updateResolution:self.player.naturalSize];
    
    NSArray* bitrates = [self.player getSupportedBitrates];
    int index = (int)[self.player bitrateIndex];
//    [self.actions updateBitrateList:bitrates index:index];
}

- (void)onPlayerFinish:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
    
    NSNumber* reasonNumber = notification.userInfo[BDCloudMediaPlayerPlaybackDidFinishReasonUserInfoKey];
    BDCloudMediaPlayerFinishReason reason = (BDCloudMediaPlayerFinishReason)reasonNumber.integerValue;
    switch (reason) {
        case BDCloudMediaPlayerFinishReasonEnd:
            NSLog(@"player finish with reason: play to end time");
            break;
        case BDCloudMediaPlayerFinishReasonError:
            NSLog(@"player finished with reason: error");
            break;
        case BDCloudMediaPlayerFinishReasonUser:
            NSLog(@"player finished with reason: stopped by user");
            break;
        default:
            break;
    }
}

- (void)onPlayerState:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
    
    BDCloudMediaPlayerPlaybackState state = self.player.playbackState;
//    [self.actions updatePlayerState:state];
    
    if (state == BDCloudMediaPlayerPlaybackStateStopped) {
//        [self.actions popPlayer];
    }
}

- (void)onPlayerBufferingStart:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
//    [self.actions startLoadingAnimation];
    NSLog(@"buffering start");
}

- (void)onPlayerBufferingUpdate:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
    
    NSLog(@"buffering update progress %@", notification.userInfo[BDCloudMediaPlayerBufferingProgressUserInfoKey]);
}

- (void)onPlayerBufferingEnd:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
//    [self.actions stopLoadingAnimation];
    NSLog(@"buffering end");
}

- (void)onPlayerSeekCompleted:(NSNotification*)notification {
    if (notification.object != self.player) {
        return;
    }
    NSLog(@"player seek completed");
}

//- (void)switchVideo:(VideoItem*)item {
//    self.model.url = item.url;
//    self.model.title = item.title;
//    self.model.downloadable = [self.videoSource downloadable:item.url];
//    [self.player stop];
//    [self.player reset];
//    self.player.contentString = item.url;
//    
//    [self start];
//}

#pragma mark - PlayerControlDelegate

//- (BOOL)hasPrevious {
//    VideoItem* item = [self.videoSource previousVideo:self.model.url];
//    return item != nil;
//}
//
//- (BOOL)hasNext {
//    VideoItem* item = [self.videoSource nextVideo:self.model.url];
//    return item != nil;
//}
//
//- (void)play {
//    if (self.player.playbackState == BDCloudMediaPlayerPlaybackStatePlaying) {
//        [self.player pause];
//    } else {
//        [self.player play];
//    }
//}
//
//- (void)playPrevious {
//    VideoItem* item = [self.videoSource previousVideo:self.model.url];
//    [self switchVideo:item];
//}
//
//- (void)playNext {
//    VideoItem* item = [self.videoSource nextVideo:self.model.url];
//    [self switchVideo:item];
//}
//
//- (void)download:(void(^)(BOOL cancel))cancelBlock {
//    [self.videoSource downloadVideo:self.model.url cancelBlock:cancelBlock];
//}
//
//- (void)seek:(NSTimeInterval)position {
//    [self.player seek:position];
//}
//
//- (void)realtimeVariable:(NSTimeInterval*)playableDuration  position:(NSTimeInterval*)position speed:(double*)speed {
//    *playableDuration = self.player.playableDuration;
//    *position = self.player.currentPlaybackTime;
//    *speed = self.player.downloadSpeed;
//}
//
//- (void)scale:(NSInteger)mode {
//    if (mode == 0) {
//        self.player.scalingMode = BDCloudMediaPlayerScalingModeAspectFit;
//    } else {
//        self.player.scalingMode = BDCloudMediaPlayerScalingModeAspectFill;
//    }
//}
//
//- (void)changeBitrate:(NSInteger)index {
//    [self.player setBitrateIndex:(int)index];
//}
//
//- (UIImage*)snapshot {
//    return [self.player thumbnailImageAtCurrentTime];
//}
//
//- (void)controlStop {
//    [self.player stop];
//}
//
@end
