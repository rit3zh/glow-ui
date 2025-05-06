export type RootArtist = {
  response: {
    data: {
      artistUnion: {
        __typename: string;
        discography: {
          albums: {
            items: Array<{
              releases: {
                items: Array<{
                  copyright: {
                    items: Array<{
                      text: string;
                      type: string;
                    }>;
                  };
                  coverArt: {
                    sources: Array<{
                      height: number;
                      url: string;
                      width: number;
                    }>;
                  };
                  date: {
                    day: number;
                    month: number;
                    precision: string;
                    year: number;
                  };
                  id: string;
                  label: string;
                  name: string;
                  playability: {
                    playable: boolean;
                    reason: string;
                  };
                  sharingInfo: {
                    shareId: string;
                    shareUrl: string;
                  };
                  tracks: {
                    totalCount: number;
                  };
                  type: string;
                  uri: string;
                }>;
              };
            }>;
            totalCount: number;
          };
          compilations: {
            items: Array<{
              releases: {
                items: Array<{
                  copyright: {
                    items: Array<{
                      text: string;
                      type: string;
                    }>;
                  };
                  coverArt: {
                    sources: Array<{
                      height: number;
                      url: string;
                      width: number;
                    }>;
                  };
                  date: {
                    day: number;
                    month: number;
                    precision: string;
                    year: number;
                  };
                  id: string;
                  label: string;
                  name: string;
                  playability: {
                    playable: boolean;
                    reason: string;
                  };
                  sharingInfo: {
                    shareId: string;
                    shareUrl: string;
                  };
                  tracks: {
                    totalCount: number;
                  };
                  type: string;
                  uri: string;
                }>;
              };
            }>;
            totalCount: number;
          };
          latest: {
            copyright: {
              items: Array<{
                text: string;
                type: string;
              }>;
            };
            coverArt: {
              sources: Array<{
                height: number;
                url: string;
                width: number;
              }>;
            };
            date: {
              day: number;
              month: number;
              precision: string;
              year: number;
            };
            id: string;
            label: string;
            name: string;
            playability: {
              playable: boolean;
              reason: string;
            };
            sharingInfo: {
              shareId: string;
              shareUrl: string;
            };
            tracks: {
              totalCount: number;
            };
            type: string;
            uri: string;
          };
          popularReleasesAlbums: {
            items: Array<{
              copyright: {
                items: Array<{
                  text: string;
                  type: string;
                }>;
              };
              coverArt: {
                sources: Array<{
                  height: number;
                  url: string;
                  width: number;
                }>;
              };
              date: {
                day: number;
                month: number;
                precision: string;
                year: number;
              };
              id: string;
              label: string;
              name: string;
              playability: {
                playable: boolean;
                reason: string;
              };
              sharingInfo: {
                shareId: string;
                shareUrl: string;
              };
              tracks: {
                totalCount: number;
              };
              type: string;
              uri: string;
            }>;
            totalCount: number;
          };
          singles: {
            items: Array<{
              releases: {
                items: Array<{
                  copyright: {
                    items: Array<{
                      text: string;
                      type: string;
                    }>;
                  };
                  coverArt: {
                    sources: Array<{
                      height: number;
                      url: string;
                      width: number;
                    }>;
                  };
                  date: {
                    day: number;
                    month: number;
                    precision: string;
                    year: number;
                  };
                  id: string;
                  label: string;
                  name: string;
                  playability: {
                    playable: boolean;
                    reason: string;
                  };
                  sharingInfo: {
                    shareId: string;
                    shareUrl: string;
                  };
                  tracks: {
                    totalCount: number;
                  };
                  type: string;
                  uri: string;
                }>;
              };
            }>;
            totalCount: number;
          };
          topTracks: {
            items: Array<{
              track: {
                albumOfTrack: {
                  coverArt: {
                    sources: Array<{
                      url: string;
                    }>;
                  };
                  uri: string;
                };
                artists: {
                  items: Array<{
                    profile: {
                      name: string;
                    };
                    uri: string;
                  }>;
                };
                associationsV3: {
                  videoAssociations: {
                    totalCount: number;
                  };
                };
                contentRating: {
                  label: string;
                };
                discNumber: number;
                duration: {
                  totalMilliseconds: number;
                };
                id: string;
                name: string;
                playability: {
                  playable: boolean;
                  reason: string;
                };
                playcount: string;
                uri: string;
              };
              uid: string;
            }>;
          };
        };
        goods: {
          concerts: {
            items: Array<{
              data: {
                __typename: string;
                festival: boolean;
                location: {
                  city: string;
                  name: string;
                };
                startDateIsoString: string;
                title: string;
                uri: string;
              };
            }>;
            totalCount: number;
          };
          merch: {
            items: Array<any>;
          };
        };
        headerImage: {
          data: {
            __typename: string;
            sources: Array<{
              maxHeight: number;
              maxWidth: number;
              url: string;
            }>;
          };
        };
        id: string;
        preRelease: any;
        profile: {
          biography: {
            text: string;
            type: string;
          };
          externalLinks: {
            items: Array<{
              name: string;
              url: string;
            }>;
          };
          name: string;
          pinnedItem: {
            backgroundImageV2: {
              data: {
                __typename: string;
                sources: Array<{
                  url: string;
                }>;
              };
            };
            comment: string;
            itemV2: {
              __typename: string;
              data: {
                __typename: string;
                images: {
                  items: Array<{
                    sources: Array<{
                      height: any;
                      url: string;
                      width: any;
                    }>;
                  }>;
                };
                name: string;
                uri: string;
              };
            };
            subtitle: string;
            thumbnailImage: {
              data: {
                sources: Array<{
                  url: string;
                }>;
              };
            };
            title: string;
            type: string;
            uri: string;
          };
          playlistsV2: {
            items: Array<{
              data: {
                __typename: string;
                description: string;
                images: {
                  items: Array<{
                    sources: Array<{
                      height: any;
                      url: string;
                      width: any;
                    }>;
                  }>;
                };
                name: string;
                ownerV2: {
                  data: {
                    __typename: string;
                    name: string;
                  };
                };
                uri: string;
              };
            }>;
            totalCount: number;
          };
          verified: boolean;
        };
        relatedContent: {
          appearsOn: {
            items: Array<{
              releases: {
                items: Array<{
                  artists: {
                    items: Array<{
                      profile: {
                        name: string;
                      };
                      uri: string;
                    }>;
                  };
                  coverArt: {
                    sources: Array<{
                      height: number;
                      url: string;
                      width: number;
                    }>;
                  };
                  date: {
                    year: number;
                  };
                  id: string;
                  name: string;
                  sharingInfo: {
                    shareId: string;
                    shareUrl: string;
                  };
                  type: string;
                  uri: string;
                }>;
                totalCount: number;
              };
            }>;
            totalCount: number;
          };
          discoveredOnV2: {
            items: Array<{
              data: {
                __typename: string;
                description?: string;
                id?: string;
                images?: {
                  items: Array<{
                    sources: Array<{
                      height: any;
                      url: string;
                      width: any;
                    }>;
                  }>;
                  totalCount: number;
                };
                name?: string;
                ownerV2?: {
                  data: {
                    __typename: string;
                    name: string;
                  };
                };
                uri?: string;
              };
            }>;
            totalCount: number;
          };
          featuringV2: {
            items: Array<{
              data: {
                __typename: string;
                description: string;
                id: string;
                images: {
                  items: Array<{
                    sources: Array<{
                      height: any;
                      url: string;
                      width: any;
                    }>;
                  }>;
                  totalCount: number;
                };
                name: string;
                ownerV2: {
                  data: {
                    __typename: string;
                    name: string;
                  };
                };
                uri: string;
              };
            }>;
            totalCount: number;
          };
          relatedArtists: {
            items: Array<{
              id: string;
              profile: {
                name: string;
              };
              uri: string;
              visuals: {
                avatarImage: {
                  sources: Array<{
                    height: number;
                    url: string;
                    width: number;
                  }>;
                };
              };
            }>;
            totalCount: number;
          };
        };
        relatedMusicVideos: {
          __typename: string;
          items: Array<any>;
          totalCount: number;
        };
        saved: boolean;
        sharingInfo: {
          shareId: string;
          shareUrl: string;
        };
        stats: {
          followers: number;
          monthlyListeners: number;
          topCities: {
            items: Array<{
              city: string;
              country: string;
              numberOfListeners: number;
              region: string;
            }>;
          };
          worldRank: number;
        };
        unmappedMusicVideos: {
          __typename: string;
          items: Array<any>;
          totalCount: number;
        };
        uri: string;
        visualIdentity: {
          wideFullBleedImage: {
            __typename: string;
            extractedColorSet: {
              encoreBaseSetTextColor: {
                alpha: number;
                blue: number;
                green: number;
                red: number;
              };
              highContrast: {
                backgroundBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                backgroundTintedBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textBrightAccent: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textSubdued: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
              };
              higherContrast: {
                backgroundBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                backgroundTintedBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textBrightAccent: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textSubdued: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
              };
              minContrast: {
                backgroundBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                backgroundTintedBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textBase: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textBrightAccent: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
                textSubdued: {
                  alpha: number;
                  blue: number;
                  green: number;
                  red: number;
                };
              };
            };
          };
        };
        visuals: {
          avatarImage: {
            extractedColors: {
              colorRaw: {
                hex: string;
              };
            };
            sources: Array<{
              height: number;
              url: string;
              width: number;
            }>;
          };
          gallery: {
            items: Array<{
              sources: Array<{
                height: number;
                url: string;
                width: number;
              }>;
            }>;
          };
        };
        watchFeedEntrypoint: any;
      };
    };
    extensions: {};
  };
};
